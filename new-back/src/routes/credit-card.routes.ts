import { Router } from 'express';
import { CreditCardController } from '../controllers/credit-card.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router();
const creditCardController = new CreditCardController();

const cardValidation = [
  body('card_number').notEmpty().withMessage('Card number is required'),
  body('card_holder_name').notEmpty().withMessage('Card holder name is required'),
  body('expiry_date').notEmpty().withMessage('Expiry date is required'),
];

router.use(authenticateToken);

router.get('/', creditCardController.getCards.bind(creditCardController));
router.post('/', cardValidation, creditCardController.addCard.bind(creditCardController));

export default router; 