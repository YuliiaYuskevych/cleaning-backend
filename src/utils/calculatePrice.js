import { DifficultyServiceEnum } from '../enums/difficultyServiceEnum.js';
import { UrgencyEnum } from '../enums/urgencyEnum.js';

const calculatePrice = ({ service, urgency, user }) => {
  let price = service?.price;
  let totalMultiplier = 1;

  if (urgency === UrgencyEnum.TOMORROW) {
    totalMultiplier += 0.05;
  } else if (urgency === UrgencyEnum.WEEK) {
    totalMultiplier += 0.03;
  }

  if (service.difficulty === DifficultyServiceEnum.HARD) {
    totalMultiplier += 0.05;
  } else if (service.difficulty === DifficultyServiceEnum.MEDIUM) {
    totalMultiplier += 0.03;
  }

  if (user.isRegular) {
    totalMultiplier -= 0.03;
  }

  price = price * totalMultiplier;

  return Number.parseFloat(price.toFixed(2));
};

export default calculatePrice;
