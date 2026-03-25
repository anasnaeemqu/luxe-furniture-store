import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import contactRouter from "./contact.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";
import cartRouter from "./cart.js";
import faqsRouter from "./faqs.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(contactRouter);
router.use(ordersRouter);
router.use(cartRouter);
router.use(faqsRouter);

export default router;
