import Event from '../models/EventModel.js';
import User from '../models/UserModel.js';

export const createEvent = async (req, res) => {
  const { title, description, date, location, quota } = req.body;
  let img_url = null;
  if (req.file && req.file.path) {
    img_url = req.file.path;
  }
  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      quota,
      created_by: req.userId,
      img_url
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: {
        model: User,
        attributes: ['id', 'name', 'email']
      }
    });
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id },
      include: {
        model: User,
        attributes: ['id', 'name', 'email']
      }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { title, description, date, location, quota } = req.body;
  try {
    const event = await Event.findOne({
      where: { id: req.params.id }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    console.log("event.created_by:", event.created_by);
    console.log("req.userId:", req.userId);
    if (event.created_by !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    event.title = title;
    event.description = description;
    event.date = date;
    event.location = location;
    event.quota = quota;
    if (req.file && req.file.path) {
      event.img_url = req.file.path;
    }
    await event.save();

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.created_by !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
