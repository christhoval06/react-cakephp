<?php
  App::uses('Component', 'Controller');

  /**
   * Contains all methods necessary to work with IP.
   * Using this component you can resolve IP address and obtain informations
   * abount country, geo location and owner.
   */
  class IpComponent extends Component {

    /**
     * Obtain informations relatives to specified IP address.
     * @param  string  $ip IP to lookup for.
     * @return array Returns array containing all informations.
     */
    public function whois($ip) {
      $db = ClassRegistry::init('IpRange');
      $geo = $db->query("
        SELECT l.* FROM (
        	SELECT  ip_location_id, start
        	FROM 		ip_blocks
        	WHERE 	end >= INET_ATON('$ip') LIMIT 1
        ) AS ipb
        INNER JOIN ip_locations l ON l.id = ipb.ip_location_id
        WHERE 	ipb.start <= INET_ATON('$ip')
        LIMIT 	1;");

      $owner = $db->query("
        SELECT g.* FROM	(
          SELECT	ip_range_group_id, start, modified
          FROM		ip_ranges
          WHERE		end >= INET_ATON('$ip')
          LIMIT   250
        ) AS ipr
        INNER JOIN ip_range_groups g ON g.id = ipr.ip_range_group_id
        WHERE	ipr.start <= INET_ATON('$ip')
        ORDER BY ipr.modified DESC
        LIMIT 1");

      $hasGeo = count($geo) > 0;
      $hasOwner = count($owner) > 0;
      return array(
        'country' => $hasGeo ? $geo[0]['l']['country'] : null,
        'region' => $hasGeo ? $geo[0]['l']['region'] : null,
        'city' => $hasGeo ? $geo[0]['l']['city'] : null,
        'postal_code' => $hasGeo ? $geo[0]['l']['postal_code'] : null,
        'owner_name' => $hasOwner ? $owner[0]['g']['name'] : null,
        'owner_id' => $hasOwner ? $owner[0]['g']['id'] : null
      );
    }

    public function range($cidr) {
      list($ip, $mask) = explode('/', $cidr);
      $maskBinStr =str_repeat("1", $mask ) . str_repeat("0", 32-$mask );      //net mask binary string
      $inverseMaskBinStr = str_repeat("0", $mask ) . str_repeat("1",  32-$mask ); //inverse mask

      $ipLong = ip2long( $ip );
      $ipMaskLong = bindec( $maskBinStr );
      $inverseIpMaskLong = bindec( $inverseMaskBinStr );
      $netWork = $ipLong & $ipMaskLong;

      $start = $netWork+1;//ignore network ID(eg: 192.168.1.0)

      $end = ($netWork | $inverseIpMaskLong) -1 ; //ignore brocast IP(eg: 192.168.1.255)
      $range = array('firstIP' => $start, 'lastIP' => $end );
      $ips = array();
      $range = getIpRange($cidr);
      for ($ip = $range['firstIP']; $ip <= $range['lastIP']; $ip++) {
        $ips[] = long2ip($ip);
      }
      return $ips;
    }

    public function getClientIp() {
      $ipaddress = '';
      if (isset($_SERVER['HTTP_CLIENT_IP']))
          $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
      else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
          $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
      else if(isset($_SERVER['HTTP_X_FORWARDED']))
          $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
      else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
          $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
      else if(isset($_SERVER['HTTP_FORWARDED']))
          $ipaddress = $_SERVER['HTTP_FORWARDED'];
      else if(isset($_SERVER['REMOTE_ADDR']))
          $ipaddress = $_SERVER['REMOTE_ADDR'];
      else
          $ipaddress = 'UNKNOWN';
      return $ipaddress;
    }
  }
?>
