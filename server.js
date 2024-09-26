import express from "express";
import multer from "multer";
import path from "path";
import mysql from "mysql2/promise";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Kharageous@99",
  database: "abstore",
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("File is not an image"), false);
    }
    cb(null, true);
  },
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ABSTORE API Documentation",
      version: "1.0.0",
      description: "API documentation for the ABSTORE e-commerce app",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change this to your server URL
        description: "Local server",
      },
    ],
  },
  apis: ["./*.js"], // Path to your route files or wherever API endpoints are defined
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     description: This endpoint allows you to add a new product, along with images and associated categories.
 *     tags:
 *       - Products
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Laptop"
 *               category:
 *                 type: string
 *                 description: Comma-separated list of categories
 *                 example: "Electronics,Computers"
 *               regDate:
 *                 type: string
 *                 format: date
 *                 description: Registration date of the product
 *                 example: "2024-09-12"
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 1299.99
 *               quantity:
 *                 type: number
 *                 description: Available quantity of the product
 *                 example: 50
 *               description:
 *                 type: string
 *                 description: A detailed description of the product
 *                 example: "A high-performance laptop with 16GB RAM"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files for the product
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the newly created product
 *                 message:
 *                   type: string
 *                   example: "Product added successfully!"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */
// Endpoint to add a new product
app.post("/api/products", upload.array("images"), async (req, res) => {
  const { name, category, regDate, price, quantity, description } = req.body;
  const imagePaths = req.files ? req.files.map((file) => file.path) : [];
  const categories = category ? category.split(",") : [];

  if (!name || !price || !quantity || !regDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [productResult] = await connection.query(
      `
        INSERT INTO products (name, reg_date, price, quantity, description)
        VALUES (?, ?, ?, ?, ?)
      `,
      [name, regDate, price, quantity, description]
    );

    const productId = productResult.insertId;

    // Insert images associated with the product
    const imageInsertPromises = imagePaths.map((imagePath) =>
      connection.query(
        `
          INSERT INTO product_images (product_id, image_path)
          VALUES (?, ?)
        `,
        [productId, imagePath]
      )
    );
    await Promise.all(imageInsertPromises);

    // Insert categories and associate them with the product
    const categoryInsertPromises = categories.map(async (categoryName) => {
      const [categoryResult] = await connection.query(
        `
          INSERT INTO categories (name)
          VALUES (?)
          ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
        `,
        [categoryName]
      );
      return categoryResult.insertId;
    });

    const categoryIds = await Promise.all(categoryInsertPromises);

    const productCategoryInsertPromises = categoryIds.map((categoryId) =>
      connection.query(
        `
          INSERT INTO product_categories (product_id, category_id)
          VALUES (?, ?)
        `,
        [productId, categoryId]
      )
    );

    await Promise.all(productCategoryInsertPromises);

    await connection.commit();
    res
      .status(201)
      .json({ id: productId, message: "Product added successfully!" });
  } catch (error) {
    await connection.rollback();
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

// Endpoint to get a specific product by ID
app.get("/api/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const connection = await pool.getConnection();

  try {
    const [products] = await connection.query(
      `SELECT p.id, p.name, p.price, p.quantity, p.description, p.reg_date
       FROM products p
       WHERE p.id = ?`,
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch product images
    const productImagesQuery = `
      SELECT product_id, image_path
      FROM product_images
      WHERE product_id = ?`;

    const [productImageResults] = await connection.query(productImagesQuery, [
      productId,
    ]);

    // Fetch product categories
    const [categories] = await connection.query(
      `SELECT c.name AS category_name
       FROM product_categories pc
       JOIN categories c ON pc.category_id = c.id
       WHERE pc.product_id = ?`,
      [productId]
    );

    // Map images and categories to product
    const product = {
      ...products[0],
      images: productImageResults.map((img) => img.image_path),
      categories: categories.map((category) => category.category_name),
    };

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Get all products, with optional filtering by category.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit the number of products returned
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset the results
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Database error
 */

// Endpoint to get products with optional category filter
app.get("/api/products", async (req, res) => {
  const { category, search, limit = 10, offset = 0 } = req.query;
  const connection = await pool.getConnection();

  try {
    let query = `
      SELECT p.id, p.name, p.reg_date, p.price, p.quantity, p.description
      FROM products p
    `;
    let params = [];

    // Add conditions for category and search
    if (category) {
      query += `
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON pc.category_id = c.id
        WHERE c.name = ?
      `;
      params.push(category);
    }

    if (search) {
      query += category ? " AND " : " WHERE ";
      query += `
        (p.name LIKE ? OR p.description LIKE ?)
      `;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [products] = await connection.query(query, params);

    // If there are no products, return an empty array
    if (products.length === 0) {
      return res.json([]);
    }

    // Fetch product images
    const productImagesQuery = `
      SELECT product_id, image_path
      FROM product_images
      WHERE product_id IN (${products.map(() => "?").join(",")})
    `;
    const productImageResults = await connection.query(
      productImagesQuery,
      products.map((p) => p.id)
    );

    // Fetch product categories
    const productCategoriesQuery = `
      SELECT pc.product_id, c.name AS category_name
      FROM product_categories pc
      JOIN categories c ON pc.category_id = c.id
      WHERE pc.product_id IN (${products.map(() => "?").join(",")})
    `;
    const productCategoryResults = await connection.query(
      productCategoriesQuery,
      products.map((p) => p.id)
    );

    // Map categories and images to products
    const productMap = new Map(
      products.map((p) => [p.id, { ...p, images: [], categories: [] }])
    );

    productImageResults[0].forEach((img) => {
      productMap.get(img.product_id).images.push(img.image_path);
    });

    productCategoryResults[0].forEach((cat) => {
      productMap.get(cat.product_id).categories.push(cat.category_name);
    });

    res.json(Array.from(productMap.values()));
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       400:
 *         description: Invalid product ID
 *       500:
 *         description: Database error
 */

// Endpoint to delete a product
app.delete("/api/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete associated images
    await connection.query(`DELETE FROM product_images WHERE product_id = ?`, [
      productId,
    ]);

    // Delete associations with categories
    await connection.query(
      `DELETE FROM product_categories WHERE product_id = ?`,
      [productId]
    );

    // Delete the product
    await connection.query(`DELETE FROM products WHERE id = ?`, [productId]);

    await connection.commit();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates a product's details, including images.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               regDate:
 *                 type: string
 *                 format: date
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product ID or missing required fields
 *       500:
 *         description: Database error
 */

// Endpoint to update a product
app.put("/api/products/:id", upload.array("images"), async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { name, description, price, quantity, regDate } = req.body;
  const imagePaths = req.files ? req.files.map((file) => file.path) : [];

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (!name || !price || !quantity || !regDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update product details
    const [updateResult] = await connection.query(
      `
        UPDATE products
        SET name = ?, description = ?, price = ?, quantity = ?, reg_date = ?
        WHERE id = ?
      `,
      [name, description, price, quantity, regDate, productId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Product not found" });
    }

    // Update images
    if (imagePaths.length > 0) {
      // Delete old images
      await connection.query(
        `DELETE FROM product_images WHERE product_id = ?`,
        [productId]
      );

      // Insert new images
      const imageInsertPromises = imagePaths.map((imagePath) =>
        connection.query(
          `
            INSERT INTO product_images (product_id, image_path)
            VALUES (?, ?)
          `,
          [productId, imagePath]
        )
      );
      await Promise.all(imageInsertPromises);
    }

    await connection.commit();
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  } finally {
    connection.release();
  }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories
 *     description: Get a list of all product categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Database error
 */

// Endpoint to get all categories
app.get("/api/categories", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [categories] = await connection.query(`
      SELECT id, name
      FROM categories
    `);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with the provided details.
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profileImagePath:
 *                 type: string
 *               registrationDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 *       500:
 *         description: Database error
 */

// Endpoint to create a new user
app.post("/api/users", async (req, res) => {
  const {
    username,
    email,
    password_hash,
    firstName,
    lastName,
    profileImagePath,
    registrationDate,
  } = req.body;

  if (!username || !email || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();

  try {
    // Check if the user already exists
    const [existingUser] = await connection.query(
      `SELECT id FROM users WHERE email = ? OR username = ?`,
      [email, username]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ error: "User with this email or username already exists" });
    }

    // Insert the new user
    const [result] = await connection.query(
      `
        INSERT INTO users (username, email, password_hash, first_name, last_name, profile_image_path, registration_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        username,
        email,
        password_hash || "", // Allow empty password_hash
        firstName,
        lastName,
        profileImagePath,
        registrationDate,
      ]
    );

    res
      .status(201)
      .json({ id: result.insertId, message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

// Endpoint to get all users
app.get("/api/users", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.query(`
      SELECT id, username, email, first_name AS firstName, last_name AS lastName, profile_image_path AS profileImagePath, registration_date AS registrationDate
      FROM users
    `);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Database error" });
  } finally {
    connection.release();
  }
});

// Endpoint to authenticate users
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const connection = await pool.getConnection();

  try {
    // Fetch user by email
    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Compare the provided password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Respond with user data (excluding password_hash)
    const { password_hash, ...userData } = user;
    res.status(200).json({ user: userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    connection.release();
  }
});

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API documentation available at http://localhost:${port}/api-docs`
  );
});
