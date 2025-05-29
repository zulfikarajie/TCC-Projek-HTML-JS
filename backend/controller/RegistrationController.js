import Registration from '../models/RegistModel.js';
import Event from '../models/EventModel.js';
import User from '../models/UserModel.js';

export const registerEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.eventId }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const existingRegistration = await Registration.findOne({
      where: {
        user_id: req.userId,
        event_id: req.params.eventId
      }
    });
    if (existingRegistration) return res.status(400).json({ message: 'Already registered' });

    const registration = await Registration.create({
      user_id: req.userId,
      event_id: req.params.eventId,
      status: 'registered'
    });
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRegistrationsByEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.eventId }
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.created_by !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    const registrations = await Registration.findAll({
      where: { event_id: req.params.eventId },
      include: {
        model: User,
        attributes: ['id', 'name', 'email']
      }
    });
    res.json(registrations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
