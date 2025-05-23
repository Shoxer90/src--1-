import React, { memo } from 'react';
import styles from "./index.module.scss";

const PrivacyPolicy = () => {
  return (
    <div className = {styles.privacy}>
			<h3 style={{textAlign:"center"}}>StoreX Privacy and Policy</h3>
			<div className={styles.privacy_subtitles}>About product:</div>
			<p>The storex.payx.am website and StoreX app are designed for E-commerce in order to generate electronic cash register (ECR) receipt regulated by the State legislation.</p>
			<div className={styles.privacy_subtitles}>Beneficiary:</div>
			<p>
				The storex.payx.am website and StoreX app can be used by registered merchants’ staff only (Users). The merchants are state registered legal entities and Individual Entrepreneurs. Further, after the ratification of the relevant contact the User receives the first log-in details.
				The storex.payx.am website and StoreX app is committed to protecting the privacy and accuracy of confidential information to the extent possible, subject to provisions of state and law. Other than as required by laws that guarantee public access to certain types of information, or in response to subpoenas or other legal instruments that authorize access, personal information is not actively shared. In particular, we do not re-distribute or sell personal information collected on our web servers.
			</p>
			<div className={styles.privacy_subtitles}>Information collected: </div>
			<p>
				The storex.payx.am website and StoreX app 
				<strong> servers collect the following analytics: </strong> 
				<div>After the first log-in details, strox.payx.am website and StoreX appUser can change his login and password that has been provided automatically by StoreX system.</div>
			</p>
			<div className={styles.privacy_subtitles}>The storex.payx.am website and StoreX app servers collect the following analytics: </div>
			<ul>
				<li>referring web page </li>
				<li>date and time</li>
			</ul>
			<div className={styles.privacy_subtitles}>The storex.payx.am website and StoreX app  does not associate this data to individual<div>User identities.</div> </div>
			<ul>
				<li>CalNet UID</li>
			</ul><div className={styles.privacy_subtitles}>Cookies </div>
			<p>The storex.payx.am website may use "cookies" in order to deliver web content specific to individual users' interests or to keep track of online purchasing transactions. Sensitive personal information is not stored within cookies.</p>
			<div className={styles.privacy_subtitles}>Use of collected information:</div>
			<p>The following merchants’ details can be used: </p>
			<ul>
				<li>Merchant names</li>
				<li>Addresses</li>
				<li>TIN</li>
				<li>Contacts</li>
				<li>The names of goods & services with the quantities & prices.</li>
				<li>Taxation type</li>
			</ul>
			<p>The details entered by the Users (except of the private page login and password) are used only in E-commerce platforms to generate purchase receipt and to transfer it to the State Revenue Committee in the manner prescribed by law. The Users’ details are used only to generate purchase receipt, which are not provided or sold to other parties.</p>
			<ul>
				<li>The storex.payx.am website and StoreX app will only use personal data collected from this site in order to communicate with the User, who contact us through the website.</li>
				<li>The information collected by The storex.payx.am website and StoreX app is used to identify User accessing secure content, and to pre-fill forms with information about the User submitting the form.</li>
			</ul>
			<div className={styles.privacy_subtitles}>Distribution of collected information:</div>
			<ul>
				<li>We will not disclose, without User consent, personal information collected about User, except for certain explicit circumstances in which disclosure is required by law.</li>
				<li>We will not distribute or sell personal information to third-party organizations.</li>
			</ul>
			<div className={styles.privacy_subtitles}>Privacy Statement Revisions:</div>
			<p>This Privacy Statement was last revised on 24/02/2022. We may change this Privacy Statement at any time and for any reason. We encourage User to review this Privacy Statement each time you visit the web site.</p>
			<p>If we make a significant change to our Privacy Statement, we will post a notice on the homepage of our web site for a period of time after the change is made. </p>
			<div className={styles.privacy_subtitles}>Responsibility for External Sites:</div>
			<p>If we make a significant change to our Privacy Statement, we will post a notice on the homepage of our web site for a period of time after the change is made. </p>
			<p>We are not responsible for the performance of web sites operated by third parties or for your business dealings with them. Therefore, whenever you leave this web site we recommend that you review each web site's privacy practices and make your own conclusions regarding the adequacy of these practices.</p>
			<div className={styles.privacy_subtitles}>How to contact us</div>
			<p>While using our services, you may encounter hypertext links to the Web pages of other websites or organizations not directly affiliated with us. We don’t control the content or information practices of external organizations.  We recommend you to review the privacy statements of these organizations.</p>
    </div>
  )
}

export default memo(PrivacyPolicy);
