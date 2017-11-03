<?php
  App::uses('Component', 'Controller');
  App::uses('CakeText', 'Utility');

  /**
   * Provide an easy way to upload files.
   */
  class FileUploaderComponent extends Component {

    public function upload($folderDir, $files = null) {
      $folderPath = WWW_ROOT . $folderDir;
      $result = array(
        'error' => false,
        'message' => '',
        'max_size' => ini_get('upload_max_filesize'),
        'files' => array()
      );
      if (!is_dir($folderPath)) {
        $result['error'] = true;
        $result['message'] = "Directory '$folderPath' not found on server.";
      }
      if (!isset($files) || is_null($files)) {
        $files = $_FILES;
      }
      foreach($files as $file) {
        switch($file['error']) {
          case 0:
            $now = date('Y-m-d-His');
            $filename = str_replace(' ', '-', $file['name']);
            $filepath = $now . '-' . $filename;
            $success = move_uploaded_file($file['tmp_name'], $folderPath . DS . $filepath);
            if ($success) {
              $result['files'][] = array(
                'filename' => $file['name'],
                'filepath' => $folderDir . DS . $filepath,
                'error' => false,
                'messsage' => 'File uploaded with success.'
              );
            }
            else {
              $result['files'][] = array(
                'filename' => $file['name'],
                'filepath' => '',
                'error' => false,
                'messsage' => "Unable to upload file: $success"
              );
            }
            break;
          case 3:
            $result['files'][] = array(
              'filename' => $file['name'],
              'filepath' => '',
              'error' => true,
              'message' => "Error uploading file, please try again."
            );
            break;
        }
      }
      return $result;
    }

  }
?>
