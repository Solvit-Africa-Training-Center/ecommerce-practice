import { EventEmitter } from "events";
import { Product } from "../database/models/Products";
import { User } from "../database/models/Users";
import { io } from "../index";
import { sendEmailNotification } from "../utils/sendEmail";

export const eventEmitter = new EventEmitter();

// Fetch product with owner info
const fetchProductWithUser = async (productId: string) => {
  return await Product.findOne({
    where: { id: productId },
    include: { model: User, as: "user", attributes: ["id", "email", "name"] },
  });
};

// Send socket + email
export const saveAndEmitNotification = async (
  userId: string,
  message: string,
  event: string
) => {
  io.to(userId).emit(event, message); 
  await sendEmailNotification(userId, message); 
};

// Listener
eventEmitter.on("productAdded", async (product) => {
  const productWithUser = await fetchProductWithUser(product.id);
  const userId = productWithUser?.userId;

  if (!userId) return;

  const message = ` Product "${product.name}" has been added successfully.`;
  await saveAndEmitNotification(userId as string, message, "productAdded");
});
