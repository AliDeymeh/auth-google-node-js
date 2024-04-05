const APIFeatures = require('./serviceApiFeatures');

const AppError = require('./appError');
const catchAsync = require('./catchAsync');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.googleId) filter = { googleId: req.params.googleId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      message: `اطلاعات مورد نظر یافت شد`,
      results: doc.length,
      data: doc
    });
  });
exports.getOne = (Modal, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Modal.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('اطلاعاتی با این ایدی یافت نشد', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOneForFilter = (Modal, filter, data) => {
  let query;
  let doc;
  catchAsync(async function() {
    query = Modal.findOne({ filter: data });
    doc = await query;
  });
  return doc;
};

exports.createOne = (Modal, data) =>
  catchAsync(async (req, res, next) => {
    const newData = await Modal.create(data);

    res.status(201).json({
      status: 'success',
      data: newData
    });
  });

exports.deleteOne = Modal =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('اطلاعاتی با این ایدی یافت نشد', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Modal =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('اطلاعاتی با این ایدی یافت نشد', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });
