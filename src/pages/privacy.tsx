import Head from "next/head";
import Link from "next/link";
import React from "react";
import { HiChevronLeft } from "react-icons/hi";

const privacy = () => {
  return (
    <>
      <Head>
        <title>Privacy policy • Clonegram</title>
        <meta name="description" content="Clonegram by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="fixed top-0 flex w-full justify-center border-b-2 bg-white p-4 font-semibold">
          <p>Privacy Policy for clonegram</p>
          <Link href="/" passHref>
            <HiChevronLeft className="fixed right-8 mt-1 scale-150" />
          </Link>
        </h1>
        <div className="mt-14 grid h-full place-items-start bg-zinc-900 px-4 text-3xl font-light text-white">
          <h1 className="py-4 font-semibold">Privacy Policy</h1>
          <p className="text-lg">Last updated: January 09, 2023</p>
          <p className="text-lg">This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
          <p className="text-lg">
            We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the{" "}
            <Link href="https://www.privacypolicies.com/privacy-policy-generator/" target="_blank">
              Privacy Policy Generator
            </Link>
            .
          </p>
          <h1 className="py-4 font-semibold">Interpretation and Definitions</h1>
          <h2 className="py-4 text-2xl font-semibold">Interpretation</h2>
          <p className="text-lg">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          <h2 className="py-4 text-2xl font-semibold">Definitions</h2>
          <p className="text-lg">For the purposes of this Privacy Policy:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li>
              <p className="text-lg">
                <strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to clonegram.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Country</strong> refers to: Sri Lanka
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Service</strong> refers to the Website.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Third-party Social Media Service</strong> refers to any website or any social network website through which a User can log in or create an account to use the Service.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>Website</strong> refers to clonegram, accessible from{" "}
                <Link href="clonegram-ushiradineth.vercel.app/" target="_blank">
                  clonegram-ushiradineth.vercel.app/
                </Link>
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
              </p>
            </li>
          </ul>
          <h1 className="py-4 font-semibold">Collecting and Using Your Personal Data</h1>
          <h2 className="py-4 text-2xl font-semibold">Types of Data Collected</h2>
          <h3 className="py-4 text-xl font-semibold">Personal Data</h3>
          <p className="text-lg">While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li>
              <p className="text-lg">Email address</p>
            </li>
            <li>
              <p className="text-lg">First name and last name</p>
            </li>
            <li>
              <p className="text-lg">Usage Data</p>
            </li>
          </ul>
          <h3 className="py-4 text-xl font-semibold">Usage Data</h3>
          <p className="text-lg">Usage Data is collected automatically when using the Service.</p>
          <p className="text-lg">Usage Data may include information such as Your Device&lsquo;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
          <p className="text-lg">When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
          <p className="text-lg">We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</p>
          <h3 className="pb-4 pt-8 text-xl font-semibold">Information from Third-Party Social Media Services</h3>
          <p className="text-lg">The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li className="text-lg">Google</li>
            <li className="text-lg">Facebook</li>
            <li className="text-lg">Twitter</li>
            <li className="text-lg">LinkedIn</li>
          </ul>
          <p className="text-lg">If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service&lsquo;s account, such as Your name, Your email address, Your activities or Your contact list associated with that account.</p>
          <p className="text-lg">You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service&lsquo;s account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.</p>
          <h3 className="pb-4 pt-8 text-xl font-semibold">Tracking Technologies and Cookies</h3>
          <p className="text-lg">We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li className="text-lg">
              <strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.
            </li>
            <li className="text-lg">
              <strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).
            </li>
          </ul>
          <p className="text-lg">
            Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. Learn more about cookies on the{" "}
            <Link href="https://www.privacypolicies.com/blog/privacy-policy-template/#Use_Of_Cookies_Log_Files_And_Tracking" target="_blank">
              Privacy Policies website
            </Link>{" "}
            article.
          </p>
          <p className="text-lg">We use both Session and Persistent Cookies for the purposes set out below:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li>
              <p className="text-lg">
                <strong>Necessary / Essential Cookies</strong>
              </p>
              <span className="ml-4">
                <span className="text-lg">Type: Session Cookies</span>
                <span className="text-lg">Administered by: Us</span>
                <span className="text-lg">Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</span>
              </span>
            </li>
            <li className="mt-4">
              <p className="text-lg">
                <strong>Cookies Policy / Notice Acceptance Cookies</strong>
              </p>
              <span className="ml-4">
                <span className="list-disc text-lg">Type: Persistent Cookies</span>
                <span className="list-disc text-lg">Administered by: Us</span>
                <span className="list-disc text-lg">Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</span>
              </span>
            </li>
            <li className="mt-4">
              <p className="list-disc text-lg">
                <strong>Functionality Cookies</strong>
              </p>
              <span className="ml-4">
                <span className="text-lg">Type: Persistent Cookies</span>
                <span className="text-lg">Administered by: Us</span>
                <span className="text-lg">Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</span>
              </span>
            </li>
          </ul>
          <p className="text-lg">For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.</p>
          <h2 className="py-4 text-2xl font-semibold">Use of Your Personal Data</h2>
          <p className="text-lg">The Company may use Personal Data for the following purposes:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li>
              <p className="text-lg">
                <strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application&lsquo;s push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>To manage Your requests:</strong> To attend and manage Your requests to Us.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.
              </p>
            </li>
            <li>
              <p className="text-lg">
                <strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.
              </p>
            </li>
          </ul>
          <p className="text-lg">We may share Your personal information in the following situations:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li className="text-lg">
              <strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.
            </li>
            <li className="text-lg">
              <strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.
            </li>
            <li className="text-lg">
              <strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.
            </li>
            <li className="text-lg">
              <strong>With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.
            </li>
            <li className="text-lg">
              <strong>With other users:</strong> when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If You interact with other users or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your activity, communicate with You and view Your profile.
            </li>
            <li className="text-lg">
              <strong>With Your consent</strong>: We may disclose Your personal information for any other purpose with Your consent.
            </li>
          </ul>
          <h2 className="pb-4 pt-8 text-2xl font-semibold">Retention of Your Personal Data</h2>
          <p className="text-lg">The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
          <p className="text-lg">The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.</p>
          <h2 className="pb-4 pt-8 text-2xl font-semibold">Transfer of Your Personal Data</h2>
          <p className="text-lg">Your information, including Personal Data, is processed at the Company&lsquo;s operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.</p>
          <p className="text-lg">Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</p>
          <p className="text-lg">The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>
          <h2 className="pb-4 pt-8 text-2xl font-semibold">Delete Your Personal Data</h2>
          <p className="text-lg">You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
          <p className="text-lg">Our Service may give You the ability to delete certain information about You from within the Service.</p>
          <p className="text-lg">You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.</p>
          <p className="text-lg">Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p>
          <h2 className="pb-2 pt-8 text-2xl font-semibold">Disclosure of Your Personal Data</h2>
          <h3 className="py-4 text-xl font-semibold">Business Transactions</h3>
          <p className="text-lg">If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
          <h3 className="pb-4 pt-8 text-xl font-semibold">Law enforcement</h3>
          <p className="text-lg">Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
          <h3 className="pb-4 pt-8 text-xl font-semibold">Other legal requirements</h3>
          <p className="text-lg">The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li className="text-lg">Comply with a legal obligation</li>
            <li className="text-lg">Protect and defend the rights or property of the Company</li>
            <li className="text-lg">Prevent or investigate possible wrongdoing in connection with the Service</li>
            <li className="text-lg">Protect the personal safety of Users of the Service or the public</li>
            <li className="text-lg">Protect against legal liability</li>
          </ul>
          <h2 className="py-4 text-2xl font-semibold">Security of Your Personal Data</h2>
          <p className="text-lg">The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
          <h1 className="pb-4 pt-8 font-semibold">Children&lsquo;s Privacy</h1>
          <p className="text-lg">Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.</p>
          <p className="text-lg">If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent&lsquo;s consent before We collect and use that information.</p>
          <h1 className="pb-4 pt-8 font-semibold">Links to Other Websites</h1>
          <p className="text-lg">Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party&lsquo;s site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
          <p className="text-lg">We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
          <h1 className="pb-4 pt-8 font-semibold">Changes to this Privacy Policy</h1>
          <p className="text-lg">We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
          <p className="text-lg">We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.</p>
          <p className="text-lg">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
          <h1 className="pb-4 pt-8 font-semibold">Contact Us</h1>
          <p className="text-lg">If you have any questions about this Privacy Policy, You can contact us:</p>
          <ul className="ml-10 mt-2 mb-6 list-disc text-sm">
            <li className="text-lg">By email: ushiradineth@gmail.com</li>
          </ul>
        </div>
        <h1 className="flex items-center justify-center gap-1 p-4 font-semibold">
          <span>Generated using </span>
          <Link href="https://www.privacypolicies.com/privacy-policy-generator/" target="_blank">
            Privacy Policies Generator
          </Link>
        </h1>
      </main>
    </>
  );
};

export default privacy;
