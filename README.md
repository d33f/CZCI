# CZCI
ChronoZoom continuous integration  

# Installation
To get ChronoZoom up and running please follow the steps described in the installation_guide.pdf.

Please make sure that you have downloaded the latest release (at the top of the page), which can be found under the following - URL: https://github.com/d33f/CZCI/releases

Now click on the ZIP icon under the title of the job.

Please follow the steps being shown in the Quickstart ChronoZoom.pdf
- This file can be found here: https://www.dropbox.com/s/hrh6e0tmk564nte/Quickstart%20ChronoZoom.pdf?dl=0

Script to create the database structure
- https://github.com/d33f/CZCI/blob/master/database.sql

Web.config connection string (default is student live server, if you want to use your own SQL server, replace the existing connection string)

<connectionStrings>
    <add name="DBstring" connectionString="Data Source=84.246.4.143,9135;Initial Catalog=Quist1Chronozoom;User Id=Quist1Chronozoom;Password=chronozoom1;" providerName="System.Data.SqlClient" />
    <!--<add name="DBstring" connectionString="Data Source=sql8.mijnhostingpartner.nl;Initial Catalog=Quist1Chronozoom;User Id=Quist1Chronozoom;Password=chronozoom1;" providerName="System.Data.SqlClient" />-->
</connectionStrings>

