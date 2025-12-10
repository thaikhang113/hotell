// file: controllers/siteController.js
class SiteController {
  // [GET] /
  home(req, res) {
    res.render("home", { title: "Home | KETO" });
  }

  // [GET] /about
  about(req, res) {
    res.render("about", { title: "About Us | KETO", pageName: "ABOUT US" });
  }

  // [GET] /our-room
  rooms(req, res) {
    res.render("rooms", { title: "Our Rooms | KETO", pageName: "OUR ROOM" });
  }

  // [GET] /gallery
  gallery(req, res) {
    res.render("gallery", { title: "Gallery | KETO", pageName: "GALLERY" });
  }

  // [GET] /blog
  blog(req, res) {
    res.render("blog", { title: "Blog | KETO", pageName: "BLOG" });
  }

  // [GET] /contact-us
  contact(req, res) {
    res.render("contact", {
      title: "Contact Us | KETO",
      pageName: "CONTACT US",
    });
  }
}

export default new SiteController();
