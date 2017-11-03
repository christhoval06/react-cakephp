<?php
  class SyncShell extends AppShell {
    public $tasks = array('Sync');
    public function main() {
      $this->Sync->execute();
    }
  }
?>
