# COMP90054-Contest-Result-Display-Tool
A handful tool for displaying the results of COMP90054 Pacman Contest (COMP90054 AI Planning and Autonomous Assignment 3)

<hr/>
<h3>Code logic</h3>
<ol>
  <li>Make request to the original result page hosted on http://115.146.95.253 + '/xxxx/result.html'</li>
  <li>parse the responsed HTML code, and find out the 2 table elements (one for ranking table, and one for match table)</li>
  <li>Extract data out of the table elements based on given 'teamname' parameter. (parameter is provided by front-end user input)</li>
  <li>Using ejs view engine to render those data into the HTML code</li>
  <li>Response it back to user</li>
<ol>
