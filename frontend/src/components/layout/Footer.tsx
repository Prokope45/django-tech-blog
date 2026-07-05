export default function Footer() {
  return (
    <div id="footer" className="lazy-section" data-lazy="section" data-delay="100">
      <footer className="page-footer" style={{
        backgroundColor: 'var(--footer-bg-color)',
        color: 'var(--footer-text-color)',
        padding: '60px 0 30px',
      }}>
        <div className="container">
          <div className="row">
            <div className="extra-links col-lg-8 col-md-8 col-sm-12">
              <div className="container">
                <div className="row">
                  <h6 className="text-uppercase font-weight-bold">Additional Information</h6>
                </div>
                <div className="row mb-1">
                  <a href="https://www.jpaubel.tech/gallery/">
                    <p>Home page photo taken by Jared Paubel, owner of this site</p>
                  </a>
                </div>
                <div className="row mb-1">
                  <a href="https://codepen.io/ishaansaxena/pen/WoJGRK">
                    <p>Index page contact buttons based on codepen by Ishaan Saxena</p>
                  </a>
                </div>
                <div className="row mb-1">
                  <a href="https://www.flaticon.com/free-icons/caution" title="caution icons">
                    <p>Caution icons created by Freepik - Flaticon</p>
                  </a>
                </div>
                <div className="row mb-1">
                  <a href="https://lokeshdhakar.com/projects/lightbox2/">
                    <p>Lightbox2 Gallery page Lightbox2 styling by Lokesh Dhakar</p>
                  </a>
                </div>
                <div className="row mb-1">
                  <a
                    href="//www.dmca.com/Protection/Status.aspx?ID=450cc4b7-da5c-4f95-97ea-0c5fedf1037e"
                    title="DMCA.com Protection Status"
                    className="dmca-badge"
                  >
                    <img
                      src="https://images.dmca.com/Badges/dmca-badge-w200-5x1-11.png?ID=450cc4b7-da5c-4f95-97ea-0c5fedf1037e"
                      alt="DMCA.com Protection Status"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="contact-links col-lg-4 col-md-4 col-sm-12">
              <h6 className="text-uppercase font-weight-bold">Contact or Subscribe</h6>
              <p>
                <a href="mailto:jay@prokope.io" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-envelope fa-lg mr-2"></i>jay@prokope.io
                </a>
                <br />
                <a href="https://jaredp45.github.io/" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-github fa-lg mr-2"></i>Github Page
                </a>
                <br />
                <a href="https://linkedin.com/in/jared-paubel" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-linkedin fa-lg mr-2"></i>LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="footer-copyright text-center" style={{ padding: '40px 0' }}>
          <p>
            2024 &copy; Prokope.io
            <br />Made with <i className="fa fa-heart fa-sm"></i> from Manhattan, Kansas
          </p>
        </div>
      </footer>
      <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"></script>
    </div>
  );
}
