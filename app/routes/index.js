import Ember from 'ember';

export default Ember.Route.extend({
activate() {
  this.modelFor("application").class = "no-sidebars page-sign-up-home";
},
model(){
  return Ember.RSVP.hash({
    page: {
        "body": "<h1>Join us at<br> the AIA <br></h1><p>No matter where you live, where you practice, or where you are in your career, your AIA membership connects you to top-quality education, critical business and career resources, and a community deeply engaged in promoting the value of architecture.</p>",
        "field_aia_image": "http://localhost/aia-dev2/sites/dev/files/banner.jpg",
        "title": "Join"
      },
    benefits: [
      {
        "nid": "66",
        "title": "Select your status",
        "body": '<p>These great core benefits are enjoyed by AIA members.</p><div class="main-container"><section class="main_block1"><div class="block1"><h4>AIA chapters</h4><p>New members are immediately connected to benefits at the local, state, and national levels.</p></div><div class="block2"><h4>Continuing education</h4><p>Shape your future with a top quality education from leaders in the field.</p></div><div class="block3"><h4>Industry research</h4><p>Take advantage of the latest practice trends, market intelligence, and economic data.</p></div></section><section class="main_block2"><div class="block4"><h4>Advocacy</h4><p>AIA is your legislative advocate at all levels of government.</p></div><div class="block5"><h4>Business and career resources</h4><p>AIA can help you promote your work, run your business, hire, and find a job.</p></div><div class="block6"><h4>Recognition</h4><p>Our 30+ award programs celebrate diverse professional accomplishments.</p></div></section><section class="main_block3"><div class="block7"><h4>Member discounts</h4><p>Save money with the AIA, Partner, and trade discounts.</p></div><div class="block8"><h4>AIA Convention</h4><p>It&#8217;s one of the largest annual gatherings of architects and professionals in the US.</p></div><div class="block9"><h4>AIA member designations</h4><p>The AIA credential gives you instant credibility with clients and employers.</p></div></section></div>'
      },
      {
        "nid": "71",
        "title": "an actively licensed  U.S. architect",
        "body": '<p>Your work is your passion, and we take your career seriously. Member benefits include:</p><ul><li>Being part of a diverse, influential community (currently 85,000 worldwide) </li><li>Research on practice trends, economic forecasts, and compensation data</li><li>Local connections, networking, and events</li><li>Use of the AIA designation, which gives you credibility with clients and employers</li><li>Resources to help you manage your firm and fuel your passion</li><li>Job postings and salary information to help you get your next job or make your next hire</li><li>Five-star courses through AIAU, AIA Convention, and your local chapter</li><li>An AIA transcript, accepted by nearly all state licensing boards, to track continuing education</li><li>Discounts on AIA Contract Documents, master specifications, insurance, and more plus trade discounts to share with clients</li></ul><p class="last-para">Put these benefits&#8212;and more&#8212;to work for you.</p>'
      },
      {
        "nid": "76",
        "title": "an international architect",
        "body": '<p>No matter where you live, we&#8217;ll help you do your best work. Member benefits include:</p><ul><li>Being part of an international network who shares your passion for design</li><li>Use of the Intl. Assoc. AIA designation, which gives you credibility with clients and employers</li><li>Local connections, networking, and events </li><li>Research on practice trends, economic forecasts, and compensation data </li><li>Resources to help you manage your firm</li><li>Five-star courses on demand through AIAU, plus your local chapter and AIA Convention</li><li>An AIA transcript to track continuing education</li><li>Discounts on AIA Contract Documents, master specifications, insurance, and more plus trade discounts to share with clients</li><li>Job postings and salary information to help you get your next job or make your next hire</li></ul><p class="last-para">Put these benefits&#8212;and more&#8212;to work for you.</p>'
      },
      {
        "nid": "81",
        "title": "a new graduate",
        "body": '<p>Congrats! We&#8217;ll help you launch your career. Here&#8217;s how:</p><ul><li>Free membership for up to 18 months*</li><li>Instant access to a new peer network (currently 85,000 worldwide)</li><li>Job postings and salary information to help you get your next job</li><li>Use of the Assoc. AIA designation, which gives you credibility with clients and employers </li><li>Peer-to-peer learning and leadership opportunities through your local chapter</li><li>Continuing education that counts as IDP hours, plus an AIA transcript to track it</li><li>ARE study resources and scholarships</li><li>Ways to get involved in topics that impact your profession and your world, like student loan debt relief</li><li>Resources and publications to fuel your passion</li></ul><p class="last-para">Put these benefits&#8212;and more&#8212;to work for you.</p>'
      },
      {
        "nid": "86",
        "title": "getting licensed",
        "body": '<p>Becoming a licensed architect just got easier. Member benefits include:</p><ul><li>ARE study resources and scholarships</li><li>Continuing education that counts as IDP hours, plus an AIA transcript to track it</li><li>Job postings and salary information to help you get your next job</li><li>Use of the Assoc. AIA designation, which gives you credibility with clients and employers</li><li>Peer-to-peer learning and leadership opportunities through your local chapter</li><li>Instant access to an extensive peer network (currently 85,000 worldwide)</li><li>Ways to get involved in topics that impact your profession and your world, like student loan debt relief</li><li>Resources and publications to fuel your passion</li></ul><p class="last-para">Put these benefits&#8212;and more&#8212;to work for you.</p>'
      },
      {
        "nid": "91",
        "title": "not licensed",
        "body": '<p>Whatever your career path, we&#8217;ll help you do your best work. Member benefits include:</p><ul><li>Being part of a diverse, influential community (currently 85,000 worldwide) </li><li>Research on practice trends, economic forecasts, and compensation data </li><li>Local connections, networking, and events Use of the Assoc. AIA designation, which gives you credibility with clients and employers</li><li>Five-star courses through AIAU, AIA Convention, and industry providers</li><li>An AIA transcript to track continuing education credits </li><li>Discounts on AIA Contract Documents, master specifications, insurance, and more plus trade discounts to share with clients</li><li>Job postings and salary information to help you get your next job or make your next hire</li></ul><p class="last-para">Put these benefits&#8212;and more&#8212;to work for you.</p>'
      },
      {
        "nid": "96",
        "title": "an allied professional",
        "body": '<p>Whether you&#8217;re a professional colleague, enthusiast, or wild dreamer, we&#8217;ll help you do your best work. Membership benefits include:</p><ul><li>Being part of a diverse, influential community (currently 85,000 worldwide) </li><li>Research on practice trends, economic forecasts, and compensation data </li><li>Job postings and salary information to help you get your next job or make your next hire</li><li>Five-star courses through AIAU, AIA Convention, and industry providers </li><li>An AIA transcript to track continuing education</li><li>Discounts on AIA Contract Documents, master specifications, insurance, and more plus trade discounts to share with clients</li><li>Resources and publications to fuel your passion</li></ul><p class="last-para">Put these benefits&#8212;and more&#8212;to work for you.</p>'
      }
    ]
  });
}

});