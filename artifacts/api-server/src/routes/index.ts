import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import productsRouter from "./products";
import ordersRouter from "./orders";
import cartRouter from "./cart";
import faqsRouter from "./faqs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(contactRouter);
router.use(ordersRouter);
router.use(cartRouter);
router.use(faqsRouter);

export default router;
