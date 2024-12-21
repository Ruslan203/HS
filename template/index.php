<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<style>
		* {padding: 0; margin: 0; border: 0; box-sizing: border-box;}
		body,html {height: 100%;}
		body {font-family: Helvetica; font-size: 16px; line-height: 24px;}
		div.cont {display: flex; align-items: center; padding: 0 20%; height: 100%;}
		h1 {padding-bottom: 20px;}
		ul {list-style-position: inside;}
		ul li {padding: 5px 0;}
		a {color:#000; text-decoration: underline;}
		a:hover {text-decoration: none;}
	</style>
</head>
<body>

	<div class="cont">
		<div class="wrap">
			<h1>rustattoo</h1>
			<ul>
				<? foreach (glob("*.html") as $filename) echo "<li><a href='".$filename."' target='_blank'>".$filename."</a></li>"; ?>
			</ul>
		</div>
	</div>

</body>
</html>