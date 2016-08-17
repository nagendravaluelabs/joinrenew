#!/usr/bin/perl
use JSON;



	###################### Finding the pull request's (pr) number using the Github's API issues option ######################
	
	$issuesjson = `curl -H "Authorization: token f79660d7dea9f0f3f4bf312cec496c035bd16283" https://api.github.com/repos/aiadigitaltransformation/aia-joinrenew-web/issues`;
	# Decode the statuses response to json and fetch the status value via state key
	
	
	$decodedissuesjson = decode_json($issuesjson);
	#print $decodedissuesjson;
	@arrayofissues = @{ $decodedissuesjson };
	$issueslength = @arrayofissues;
	print "\n\n\n	************************************************************************	\n\n";
	print "	TOTAL COUNT OF OPEN PULL REQUESTS BEING PROCESSED:  $issueslength	\n\n";
	print "	************************************************************************	\n";
	
	
	
	###################### Executing the pull request merge process for multiple number of pull requests existing in the repository  ######################
	
	for($issuesctr=0; $issuesctr < $issueslength; $issuesctr++)
	{
		
		$currentissue = @arrayofissues[$issuesctr];
		$pullrequestno = $currentissue->{"number"};
		print "\n\n\n	#########################################################################	\n";
		print "	#########################################################################	\n";
		print "	#########################################################################	\n";
		print "\n\n\n	Current pull request being processed is <<<<<  $pullrequestno  >>>>>\n\n\n";

	

		###################### Finding the source and target branches details of the pull request (pr) ######################
		
		$prdetails = `curl -H "Authorization: token f79660d7dea9f0f3f4bf312cec496c035bd16283" https://api.github.com/repos/aiadigitaltransformation/aia-joinrenew-web/pulls/$pullrequestno`;
		#$prdetails = `curl -H "Authorization: token f79660d7dea9f0f3f4bf312cec496c035bd16283" $prhtml`;
		#Decode the pull request branch details' json object and fetch the Source and Target branches of merge via base/head ref values
		$decodedprdetails = decode_json($prdetails);
		#print $decodedprdetails;
		print"\n\n\n";
		$sourcebr = $decodedprdetails->{'head'}{'ref'};
		$targetbr = $decodedprdetails->{'base'}{'ref'};
		$statusurl = $decodedprdetails->{'statuses_url'};
		$SHAid = $decodedprdetails->{'head'}{'sha'};
		$prtitle = $decodedprdetails->{'title'};
		$prechkisprmerged = $decodedprdetails->{'merged'};
		$prechkisprmergeable = $decodedprdetails->{'mergeable'};


		print "	Source branch = " . $sourcebr . "\n";
		print "	Target branch = " . $targetbr . "\n";
		print "	Status url = " . $statusurl . "\n";
		print "	Sha id value = " . $SHAid . "\n";
		print "	Title of pr = " . $prtitle . "\n";
		print "	Pre-check isMerged status of pr = " . $prechkisprmerged . "\n";
		print "	Pre check isMergeable status of pr = " . $prechkisprmergeable . "\n";

		print"\n\n\n";



		###################### Finding the status of the build triggered against the above pull request ######################

		$bldstatuses = `curl -H "Authorization: token f79660d7dea9f0f3f4bf312cec496c035bd16283" $statusurl`;
		#print $buildstatusjson;

		# Decode the statuses response to json and fetch the status value via state key
		$decodedbldstatuses = decode_json($bldstatuses);
		#print $decodedbldstatus . "\n";
		@statusentries = @{ $decodedbldstatuses };
		$lateststatusentry = @statusentries[0];
		$finalbldstatus = $lateststatusentry->{"state"};
		#print "\n\n\n	Finally found build status as <<<<< " . $finalbldstatus . " >>>>> for the pull request no. <<<<< " . $pullrequestno . " >>>>> \n\n\n";

		print "\n\n\n	Finally found build status as <<<<<  $finalbldstatus  >>>>> for the pull request no. <<<<<  $pullrequestno  >>>>> \n\n\n";


		###################### Merge pull request by conditional checking of the states of the above pull request ######################
		
		#if( $finalbldstatus eq 'success' )
		if( $finalbldstatus && !$prechkisprmerged )
		{
			#if ($targetbr = 'build-auto-test')
			if ($targetbr = 'development')
			{
				print "\n\n\n	Considering the pull request no. <<<<<  $pullrequestno  >>>>> with target branch <<<<<  $targetbr  >>>>> for merge\n\n\n";
				
				#print "Inside the loop";
				if ( $prechkisprmergeable )
				{
				#print "\nInside inner loop\n ShaId: $SHAid Squash: true commit_title: $prtitle Pull request $pullrequestno\n\n";
				print " \n\n\n	Build against pr <<<<<  $pullrequestno  >>>>> is a success. \n\n	Now proceeding ahead with pr merging. \n\n";
				$prmergeoutput =  `curl -XPUT -H "Authorization: token f79660d7dea9f0f3f4bf312cec496c035bd16283" -H "Accept: application/vnd.github.polaris-preview" -d '{"sha": "$SHAid", "squash": true, "commit_title": "$prtitle", "commit_message": "Build automation pr merge"}' https://api.github.com/repos/aiadigitaltransformation/aia-joinrenew-web/pulls/$pullrequestno/merge`;
				$decdprmergeoutput = decode_json($prmergeoutput);
				print"\n\n\n";
				$isprmerged = $decdprmergeoutput->{'merged'};
				$prmergedmsg = $decdprmergeoutput->{'message'};
				$prmergedshaid = $decdprmergeoutput->{'sha'};
					if ( $isprmerged )
					{print "\n\n	$prmergedmsg against sha id <<<<< $prmergedshaid >>>>>\n\n";
					}else
					{print "\n\n Merge of the pull request <<<<< $pullrequestno >>>>> has issues that need resolution. Issue found is <<<<< $prmergedmsg >>>>>";}
				}
				else { print "\n\n	IsMergeable check failed against pull request <<<<<  $pullrequestno  >>>>>. \n\n	#########################################################################	\n	#########################################################################	\n	#########################################################################	\n	******	Cannot go ahead with merging the pull request. Please check and fix the issue to make the pull request state <<<<<  $pullrequestno  >>>>> IsMergeable by fixing any issues in it.	*******\n\n\n";
				}
			}else {print "\n\n\n	XXXXXXXXXXX	Pull request no. <<<<<  $pullrequestno  >>>>> with target branch <<<<<  $targetbr  >>>>> is not being considered for merge XXXXXXXXXXX	\n\n\n";
			}
		}
}


