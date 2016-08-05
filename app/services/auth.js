/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
import fetch from 'ember-network/fetch';
import inject from 'ember-service/inject';
import moment from 'moment';
import RouteRefresherMixin from '../mixins/route-refresher';
const SLEEP_POLL_INTERVAL = 60 * 1000;
export default Ember.Service.extend(RouteRefresherMixin, {
  userData: inject(),
  janrain: inject(),
  authState: "",
  _refreshOnWakeFromSleep() {
    let lastTime = (new Date()).getTime();

    let oldSleepInterval = this.get('sleepInterval');
    if (oldSleepInterval) {
      clearInterval(oldSleepInterval);
    }
    let sleepInterval = setInterval(() => {
      let currentTime = (new Date()).getTime();
      if (currentTime > (lastTime + SLEEP_POLL_INTERVAL * 2)) {  // ignore small delays
        // Probably just woke up!
        let user = this.get('user');
        Ember.run(() => {
          this.refresh(user.refresh_token);
        });
      }
      lastTime = currentTime;
    }, SLEEP_POLL_INTERVAL);
    this.set('sleepInterval', sleepInterval);
  },
  
  postTokenRequest(body) {
    var tokenReqData, self;
    self = this;
    tokenReqData = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: $.param( body )
    };
    return fetch(`${ENV.AIA_API_URL}/oauth/token`, tokenReqData).then(response => {
      switch (response.status) {
      case 200:
        return response.json().then(json => {
          let user = Object.assign(self.get('user') || {}, json);
          user.expires_at = moment().add(user.expires_in, 'seconds').format(moment.iso_8601);
          self.set('user', user);
          if (user.refresh_token && user.expires_in) {
            self._refreshOnWakeFromSleep();
            Ember.run.later(() => {
              self.refresh(user.refresh_token);
            }, user.expires_in * 1000);
          }
          if (body.grant_type !== 'refresh_token') { self.reloadRoute(); }
          return true;
        });
      case 401:
        self.reloadRoute();
        return { error: "Invalid username or password." };
      default:
        self.reloadRoute();
        return { error: "Unable to communicate with the server, please try again later." };
      }
    }, err => {
      self.reloadRoute();
      return { error: "Unable to communicate with the server, please try again later.", err };
    });
  },

  refresh(refresh_token) {
    return this.postTokenRequest({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: 'jhxbmd679pv6j3hatb3yz7xdpgtauced',
      client_secret: 'mx3zd27mcvdbkrmnr829cczcvnnr62dq'
    });
  },

  verify(token) {
    var fetchParams, fetchData;
    fetchParams = {
      type_name: "user",
      attributes: '["nfIndividualKey"]',
      max_results: 1
    };
    fetchParams = $.param( fetchParams );
    fetchData = {
      method: "POST",
      headers: {
        "Authorization": "OAuth "+token,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: fetchParams
    };
    return fetch(`${ENV.AIA_API_URL}/entity`, fetchData).then(response => {
      if(response.status === 200) {
        return response.json().then(function(json) {
          if(typeof json.result !== undefined && typeof json.result.nfIndividualKey !== undefined && json.result.nfIndividualKey!== null) {
            return json;
          } else {
            return "invalid-user";
          }
        });
      }
    });
  },

  logout() {
    if(this.get("authState") !== "invalid-invoice" && this.get("authState") !== "no-access") {
      this.set("authState", "logout");
    }
    localStorage.removeItem('aia-user');
    this.set('user', null);
    this.reloadRoute();
  },

  reloadUser() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    let json = localStorage['aia-user'];
    if (!json) {
      return;
    }
    try {
      let user = JSON.parse(json);

      this.verify(user.access_token).then(valid => {
        if (!valid) {
          if (user.refresh_token) {
            this.refresh(user.refresh_token);
          }
          this.set('user', null);
        } else if(valid === "invalid-user") {
          this.set("authState", "no-access");
          this.set("user", ["invalid"]);
          this.logout();
          this.get('janrain').doLogout();
        } else {
          let expiration = moment(user.expires_at, moment.iso_8601);
          if (expiration.isBefore(moment().add(user.expires_in / 2, 'seconds')) && user.refresh_token) {
            this.refresh(user.refresh_token);
          } else {
            let expiresIn = expiration.diff(moment());
            this._refreshOnWakeFromSleep();
            Ember.run.later(() => {
              this.refresh(user.refresh_token);
            }, expiresIn);
          }
        }
      });
      return user;
    } catch(err) {
      localStorage.removeItem('aia-user');
      throw err;
    }
  },

  user: Ember.computed({
    get() {
      return this.reloadUser();
    },
    set(k, value) {
      if (value) {
        localStorage['aia-user'] = JSON.stringify(value);
      } else {
        localStorage.removeItem('aia-user');
      }
      this.notifyPropertyChange(k);
      return value;
    }
  })
});
