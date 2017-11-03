<?php
  App::uses('Component', 'Controller');
  App::uses('HttpSocket', 'Network/Http');
  App::import('Vendor', 'SimpleHtmlDom', array('file' => 'simple_html_dom.php'));

  class MyipComponent extends Component {

    public function browseIpRangesByOwner($cookie, $page) {
      $url = "https://myip.ms/ajax_table/ip_ranges/$page/sort/2/asc/1";
      $socket = new HttpSocket();
      $response = $socket->post($url, array(
        'getpage' => 'yes',
        'lang' => 'en'
      ), array(
        'header' => array(
          'Host' => 'myip.ms',
          'Pragma' => 'no-cache',
          'Origin' => 'https://myip.ms',
          'Accept-Language' => 'it-IT,it;q=0.8,en;q=0.6,en-US;q=0.4',
          'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
          'Content-Type' => 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept' => 'text/html, */*; q=0.01',
          'Cache-Control' => 'no-cache',
          'X-Requested-With' => 'XMLHttpRequest',
          'Cookie' => $cookie,
          'Connection' => 'keep-alive',
          'Referer' => 'https://myip.ms/browse/ip_ranges/IP_Ranges_by_Owner'
        )
      ));
      $ipRanges = array();
      $html = new simple_html_dom();
      $html->load($response->body);
      foreach($html->find('tr[!class]') as $tr) {
        $range = explode(' - ', $tr->children(1)->plaintext);
        $start = ip2long(trim($range[0]));
        $end = ip2long(trim($range[1]));
        $name = html_entity_decode(trim($tr->children(2)->plaintext));
        $host = html_entity_decode(trim($tr->children(3)->plaintext));
        $flag = html_entity_decode($tr->children(2)->find('span', 0)->getAttribute('class'));
        $flag = str_replace('cflag ', '', $flag);
        $modified = html_entity_decode(trim($tr->children(4)->plaintext));
        $modified = date_parse_from_format("d M Y, H:i", $modified);
        $ipRanges[] = array(
          'name' => $name,
          'flag' => $flag,
          'range' => $range,
          'start' => $start,
          'end' => $end,
          'resolve_host' => $host,
          'modified' => $modified
        );
      }
      if( count($ipRanges) == 0 || !isset($ipRanges[0]['start']) || is_null($ipRanges[0]['start']))  {
        $ipRanges['error'] = true;
        $ipRanges['message'] = $response->body;
        $ipRanges['uri'] = $url;
      }
      return $ipRanges;
    }

  }
?>
