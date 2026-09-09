import StoreSettings from '../models/StoreSettings.js';

// @desc    Get store info (creates default if none exists)
// @route   GET /api/store-info
// @access  Public
export const getStoreInfo = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({});
    }
    return res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update store info
// @route   PUT /api/store-info
// @access  Private/Admin
export const updateStoreInfo = async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const updatedSettings = await settings.save();
    return res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
};
