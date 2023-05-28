<?php
session_start();
if(!isset($_SESSION["user"])){
$_SESSION["user"]=$_GET["userid"];
}
if(isset($_REQUEST['g-recaptcha-response'])){
$url = 'https://www.google.com/recaptcha/api/siteverify';
$post_data = array(
        'secret' => '',
        'response' => $_REQUEST['g-recaptcha-response'],
        'remoteip' => $_SERVER['REMOTE_ADDR'], // 任意
);
$options = array(
        'http' => array(
                'method' => 'POST',
                'header' => 'Content-type: application/x-www-form-urlencoded',
                'content' => http_build_query($post_data),
        )
);
$context = stream_context_create($options);
$r = json_decode(file_get_contents($url, false, $context));

if ($r->success == 1) {
    // 認証成功の処理

echo "success";
exec("node self.js ".$_SESSION["user"]. " &");
} else {
    // 認証失敗の処理
echo "faild";
}
}
?>
<html>
   <head>
     <title>reCAPTCHA</title>
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
   </head>
   <body>
     <form action="?" method="POST">
       <div class="g-recaptcha" data-sitekey=""></div>
       <br/>
       <input type="submit" value="Submit">
     </form>
   </body>
 </html>