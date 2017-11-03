<?php
  App::uses('HttpSocket', 'Network/Http');

  class SyncTask extends Shell {
    public $uses = array(
      'Deal',
      'DealCategory',
      'ShellTask'
    );

    private $socket;

    public function execute() {
      $this->socket = new HttpSocket(array(
        'ssl_allow_self_signed' => true,
        'ssl_verify_host' => false,
        'ssl_verify_peer' => false
      ));
      $this->synch();
    }

    /**
     * Sync specified category
     */
    public function synch() {
      $processedDealIds = array();
      $dealCategories = $this->DealCategory->find('all', array(
        'conditions' => array(

        )
      ));
      $deals = array();
      $responses = array();
      $skipped = array();
      $cookie = $this->createCookie();
      $itemsToProcess = count($dealCategories);
      $itemsProcessed = 0;
      $totalProcessedRecords = 0;
      $totalCreatedRecords = 0;
      $totalUpdatedRecords = 0;
      foreach($dealCategories as $dealCategory) {
        $categoryName = $dealCategory['DealCategory']['name'];
        $categoryIds = array($dealCategory['DealCategory']['code']);
        $metadata = $this->getDealMetadata($cookie, $categoryIds);
        $this->ShellTask->prepare("Processing category: $categoryName");
        if (!isset($metadata['sortedDealIDs'])) {
          $this->ShellTask->prepare("Synch - Category=$categoryName, no deal IDs found.");
          $this->ShellTask->finalize();
          continue;
        }
        $sortedDealIDs = $metadata['sortedDealIDs'];
        $dealIds = array();
        foreach($sortedDealIDs as $dealId) {
          $dealIds[] = array('dealID' => $dealId);
        }
        $dealIdsChunks = array_chunk($dealIds, 10);
        $sleepInside = count($dealIdsChunks) > 30;
        $updatedRecords = 0;
        $createdRecords = 0;
        foreach($dealIdsChunks as $chunk) {
          $results = $this->getDeals($cookie, $chunk);
          if (!isset($results['dealDetails'])) {
            $skipped[$dealCategory['DealCategory']['code']] = $results;
            continue;
          }
          foreach($results['dealDetails'] as $result) {
            $updated = $this->Deal->deleteAll(array('code' => $result['dealID']));
            $updatedRecords += $updated == TRUE ? 1 : 0;
            $createdRecords += $updated != TRUE ? 1 : 0;
            $this->Deal->create();

            $this->Deal->save(array(
              'deal_category_id' => $dealCategory['DealCategory']['id'],
              'code' => $result['dealID'],
              'title' => $result['title'],
              'description' => $result['description'],
              'url' => $result['egressUrl'],
              'max_current_price' => $result['maxCurrentPrice'],
              'max_list_price' => $result['maxListPrice'],
              'max_percent_off' => $result['maxPercentOff'],
              'max_prev_price' => $result['maxPrevPrice'],
              'merchant_id' => $result['merchantID'],
              'merchant_name' => $result['merchantName'],
              'min_current_price' => $result['minCurrentPrice'],
              'min_deal_price' => $result['minDealPrice'],
              'min_list_price' => $result['minListPrice'],
              'min_prev_price' => $result['minPrevPrice'],
              'primary_image' => $result['primaryImage'],
              'type' => $result['type'],
              'item_type' => $result['itemType'],
              'review_rating' => $result['reviewRating'],
              'score' => $result['score'],
              'total_review' => $result['totalReviews'],
              'currency_code' => $result['currencyCode'],
              'json_data' => json_encode($result)
            ));
            $totalProcessedRecords++;
          }

          if ($sleepInside) {
            $sleep = rand(5, 10);
            $this->out("Sleeping for $sleep seconds...");
            sleep($sleep);
          }
        }
        $totalCreatedRecords += $createdRecords;
        $totalUpdatedRecords += $updatedRecords;

        $itemsProcessed ++;
        $this->ShellTask->prepare("Synch - Category=$categoryName, Created=$createdRecords, Updated=$updatedRecords");
        $this->ShellTask->finalize();

        $sleep = rand(5, 10);
        $this->out("Waiting $sleep seconds...");
        sleep($sleep);
      }
      $logMessage = "Synch - Total processed records=$totalProcessedRecords";
      $logMessage .= ", created=$totalCreatedRecords";
      $logMessage .= ", updated=$totalUpdatedRecords";
      $this->ShellTask->prepare($logMessage);

      $this->ShellTask->finalize();
    }

    private function import($deals) {
      foreach($results['dealDetails'] as $result) {
        $this->Deal->deleteAll(array('code' => $result['dealID']));
        $this->Deal->create();
        $this->Deal->save(array(
          'deal_category_id' => $dealCategory['DealCategory']['id'],
          'code' => $result['dealID'],
          'title' => $result['title'],
          'description' => $result['description'],
          'url' => $result['egressUrl'],
          'max_current_price' => $result['maxCurrentPrice'],
          'max_list_price' => $result['maxListPrice'],
          'max_percent_off' => $result['maxPercentOff'],
          'max_prev_price' => $result['maxPrevPrice'],
          'merchant_id' => $result['merchantID'],
          'merchant_name' => $result['merchantName'],
          'min_current_price' => $result['minCurrentPrice'],
          'min_deal_price' => $result['minDealPrice'],
          'min_list_price' => $result['minListPrice'],
          'min_prev_price' => $result['minPrevPrice'],
          'primary_image' => $result['primaryImage'],
          'type' => $result['type'],
          'item_type' => $result['itemType'],
          'review_rating' => $result['reviewRating'],
          'score' => $result['score'],
          'total_review' => $result['totalReviews'],
          'currency_code' => $result['currencyCode'],
          'json_data' => json_encode($result)
        ));
      }
    }

    private function nocache($url) {
      $ts = new DateTime();
      return $url . "?nocache=" . $ts->format('U');
    }

    private function createCookie() {
      $res = $this->socket->get("https://www.amazon.it/gp/goldbox/watching/ref=sv_gb_0");
      return $res->getHeader('Cookie');
    }

    private function getDealMetadata($cookie, array $categoryIds) {

      $url = $this->nocache("https://www.amazon.it/xa/dealcontent/v2/GetDealMetadata");
      $data = array(
        "requestMetadata" => array(
          "clientID" => "goldbox_mobile_pc",
          "marketplaceID" => "APJ6JRA9NG5V4",
          "sessionID" => "259-1518563-8946425"
        ),
        "queryProfile" => array(
          "dealStates" => array(
             "AVAILABLE",
             "EXPIRED",
             "SOLDOUT",
             "UPCOMING",
             "WAITLIST",
             "WAITLISTFULL"
          ),
          "includedCategories" => $categoryIds,
          "excludedExtendedFilters" => array(
            "MARKETING_ID" => array("restrictedcontent")
          ),
          "includedBins" => array(
            array(
              "count" => 20,
              "name" => "discount_range"
            ),
            array(
              "count" => 20,
              "name" => "price_range"
            ),
            array(
              "count" => 100,
              "name" => "whitelist_categories"
            )
          )
        ),
        "sortOrder" => "PERSONALIZED",
        "version" => "V2.2",
        "page" => 1,
        "dealsPerPage" => 300,
        "widgetContext" => array(
          "pageType" => "GoldBox",
          "subPageType" => "main",
          "deviceType" => "pc",
          "refRID" => "8JZAZGY6H1G7H54RRECS",
          "widgetID" => "6736e119-d44d-4aae-8065-d8713c6b740e",
          "slotName" => "slot-5"
        )
      );

      return $this->post($url, $cookie, json_encode($data));
    }

    private function getDeals($cookie, array $dealIds) {
      $url = $this->nocache("https://www.amazon.it/xa/dealcontent/v2/GetDeals");
      $data = array(
        "requestMetadata" => array(
          "marketplaceID" => "APJ6JRA9NG5V4",
          "clientID" => "goldbox_mobile_pc",
          "sessionID" => "259-1518563-8946425"
        ),
        "dealTargets" => $dealIds,
        "responseSize" => "ALL",
        "itemResponseSize" => "DEFAULT_WITH_PREEMPTIVE_LEAKING",
        "widgetContext" => array(
          "pageType" => "GoldBox",
          "subPageType" => "watching",
          "deviceType" => "pc",
          "refRID" => "TE2FGCGM6W5DQAXEZ4WR",
          "widgetID" => "1aec7749-7114-4bc8-b109-d9ebe583608d",
          "slotName" => "slot-5"
        )
      );
      return $this->post($url, $cookie, json_encode($data));
    }

    private function post($url, $cookie, $data) {
      $ts = new DateTime();
      $cmd = "curl '$url' ";
      $cmd .= " -H 'Cookie: $cookie'";
      $cmd .= " -H 'Origin: https://www.amazon.it'";
      $cmd .= " -H 'Accept-Encoding: gzip, deflate, br'";
      $cmd .= " -H 'Accept-Language: it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4'";
      $cmd .= " -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'";
      $cmd .= " -H 'Content-Type: application/x-www-form-urlencoded'";
      $cmd .= " -H 'Accept: application/json, text/javascript, */*; q=0.01'";
      $cmd .= " -H 'Referer: https://www.amazon.it/gp/goldbox/watching/ref=sv_gb_0'";
      $cmd .= " -H 'X-Requested-With: XMLHttpRequest'";
      $cmd .= " -H 'Connection: keep-alive'";
      $cmd .= " --data '$data' --compressed";

      $res = exec($cmd);

      return json_decode($res, true);
    }
  }
?>
