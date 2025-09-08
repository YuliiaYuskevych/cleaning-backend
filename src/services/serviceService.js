import Service from '../models/service.js';

export const findAllServices = async ({
  page = 1,
  limit = 20,
  sort = {},
  category,
} = {}) => {
  const skip = (page - 1) * limit;
  let query = {};

  if (category) {
    query.type = category;
  }

  const services = await Service.find(query)
    .populate('category', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Service.countDocuments(query);

  return {
    data: services,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const createService = async (serviceData) => {
  const service = new Service(serviceData);
  return await service.save();
};

export const findServiceById = async (id) => {
  return await Service.findById(id).populate('category', 'name');
};

export const updateService = async (id, updateData) => {
  return await Service.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name');
};

export const deleteService = async (id) => {
  return await Service.findByIdAndDelete(id);
};

export const findServicesByCategory = async (categoryId) => {
  return await Service.find({ category: categoryId }).populate(
    'category',
    'name',
  );
};
