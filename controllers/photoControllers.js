const Photo = require('../models/Photo');
const fs = require('fs');

exports.gettAllPhotos = async (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'))
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  //console.log(req.files.image)
  //await Photo.create(req.body);
  //res.redirect('/');

  const uploadDir = 'public/uploads';

  //sync kullandı bunun sebebi klasörün olduğu doğrulanmadan sonraki adıma geçemeyiz
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};