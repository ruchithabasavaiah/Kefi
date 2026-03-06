import { Request, Response } from "express";
import * as productsService from "../services/products.service";
import { slugify } from "../lib/slug";
import { createProductSchema } from "../validators/products.schema";
import { createVariantSchema } from "../validators/variants.schema";
import { uuidParamSchema } from "../validators/params.schema";  


export async function listProducts(req: Request, res: Response) {
  const products = await productsService.listProducts();
  return res.json(products);
}

export async function createProduct(req: Request, res: Response) {
  const parsed = createProductSchema.safeParse(req.body);

  if (!parsed.success) {
  return res.status(400).json({
    error: "Validation failed",
    details: parsed.error.issues,
  }); }

  const { name, price, description } = parsed.data;

  const slug = slugify(name);

  const created = await productsService.createProduct({ name, price, description, slug });
  if (!created.ok) return res.status(409).json({ error: created.error });

  return res.status(201).json(created.product);
}

export async function createProductVariant(req: Request, res: Response) {
  const parsed = createVariantSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  const paramParsed = uuidParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
  return res.status(400).json({ error: "Validation failed", details: paramParsed.error.issues });
  }
  const productId = paramParsed.data.id;
  
  const { size, color, stock, price } = parsed.data;

  const created = await productsService.createVariant(productId, { size, color, stock, price });
  if (!created.ok) return res.status(409).json({ error: created.error });

  return res.status(201).json(created.variant);
}

export async function listProductVariants(req: Request, res: Response) {
  const paramParsed = uuidParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
  return res.status(400).json({ error: "Validation failed", details: paramParsed.error.issues });
  }
  const productId = paramParsed.data.id;
  const variants = await productsService.listVariants(productId);
  return res.json(variants);
}