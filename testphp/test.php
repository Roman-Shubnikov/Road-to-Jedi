<?php
require("vendor/autoload.php");


$s3 = new \Aws\S3\S3Client([
    'version' => 'latest',
    'region'  => 'us-east-1',
    'endpoint' => 'https://minio-server.xelene.ru:8443',
    'use_path_style_endpoint' => true,
    'credentials' => [
        'key' => 'RoadJedi',
        'secret' => 'JeDi66AeS',
   ],
]);


// $insert = $s3->putObject([
//     'Bucket' => 'roadjedi',
//      'Key'    => 'test/test.png',
//      'SourceFile' => __DIR__ . '/test.png',
// ]);
$command = $s3->getCommand('GetObject', [
    'Bucket' => 'roadjedi',
    'Key'    => 'test/test.png'
]);
$presignedRequest = $s3->createPresignedRequest($command, '+10 minutes');

// Get the actual presigned-url
$presignedUrl =  (string)  $presignedRequest->getUri();
var_dump($presignedUrl);
// var_dump($insert);