<?php
  class PasswordComponent extends Component {
    function generate($length = 8){
      $password = "";
      $i = 0;
      $possible = "0123456789bcdfghjkmnpqrstvwxyz";
      while ($i < $length){
        $char = substr($possible, mt_rand(0, strlen($possible)-1), 1);
        if (!strstr($password, $char)) {
          $password .= $char;
          $i++;
        }
      }
      return $password;
    }
  }
?>
