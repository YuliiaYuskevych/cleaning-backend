import * as serviceService from '../services/serviceService.js';

export const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortPrice, category } = req.query;
    let sort = {};

    if (sortPrice) {
      const direction = sortPrice.toLowerCase() === 'asc' ? 1 : -1;
      sort.price = direction;
    }

    const services = await serviceService.findAllServices({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      category,
    });

    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const newService = await serviceService.createService(req.body);
    res.status(201).json(newService);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to create service', error: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await serviceService.findServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const updatedService = await serviceService.updateService(
      req.params.id,
      req.body,
    );
    if (!updatedService)
      return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(updatedService);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to update service', error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deletedService = await serviceService.deleteService(req.params.id);
    if (!deletedService)
      return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete service', error: err.message });
  }
};
