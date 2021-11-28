# Express

In this tutorial, we'll talk about using dependency injection with Express to build a simple web API.

### Setup HTTP server

```tsx
import express from "express";
import { Injector, ServiceLifetime } from "tiny-injector";

const application = express();

application.listen("8080", () => {
  console.log(`${new Date()}: Server running at http://localhost:8080`);
});
```

### Create top level express middleware that will create new context for each request

```tsx
application.use((req, res, next) => {
  const context = Injector.Create();
  const dispose = () => Injector.Destroy(context);
  // At the end the current request, everything related to that context should be garbage collected
  // so you need to make sure that you let that happen by calling dispose function

  ["error", "end"].forEach((eventName) => {
    req.on(eventName, dispose);
  });

  // Helper function to be able to retrieve services easily
  req.locate = (serviceType) => context.get(serviceType);
  // Or
  req.locate = (serviceType) =>
    Injector.GetRequiredService(serviceType, context);
  next();
});
```

### The Product Model

```tsx
export class Product {
  constructor(public id: number, public price: number, public name: string) {}
}
```

### Product Service

In this snippet, the CRUD operations will be performed over the products list.

The `ProductService` is registered as **Singleton** since we need only one instance of it.

```tsx
import { Product } from "./product";
import { Injectable, ServiceLifetime } from "tiny-injector";

@Injectable({
  lifetime: ServiceLifetime.Singleton,
})
export class ProductService {
  /**
   Seed Product
  */
  private products = [
    new Product(0, 10, "iPhone"),
    new Product(1, 20, "MacBook"),
    new Product(2, 30, "MacPro"),
  ];

  getProducts() {
    return this.products;
  }

  addProduct(product: Product) {
    product.id = this.products.length;
    this.products.push(product);
  }

  updateProduct(product: Product) {
    const productIndex = this.products.findIndex((it) => it.id === product.id);
    if (productIndex < 0) {
      throw new Error(`Cannot find product with id ${product.id}`);
    }
    this.products.splice(productIndex, 1, product);
  }
}
```

### Product Controller

The `ProductController` is registered as **Scoped** because whenever a request is made new instance should be instantiated, so each request creates a fresh instance of your controller and that means a fresh instance of your variables within it.

_In this example registering the controller as **Transient** won't make difference unless you're using scoped service as a dependency._

```tsx
import { Injectable, ServiceLifetime } from "tiny-injector";
import { Product } from "./product";
import { ProductService } from "./product_service";

@Injectable({
  lifetime: ServiceLifetime.Scoped,
})
export class ProductController {
  constructor(private productService: ProductService) {}

  getProducts() {
    return this.productService.getProducts();
  }

  addProduct(product: Product) {
    return this.productService.addProduct(product);
  }

  updateProduct(product: Product) {
    return this.productService.updateProduct(product);
  }
}
```

### The Route Layer

The final stage where you connect the controller to a route

_Take a look at the start snippet where the setup middleware added to know how
`req.locate` works_

```tsx
application
  .all("/products")
  .post("/", (req, res) => {
    const productController = req.locate(ProductController);
    res.json(productController.addProduct(req.body));
  })
  .put("/:id", (req, res) => {
    const productController = req.locate(ProductController);
    res.json(productController.updateProduct(req.body));
  })
  .get("/", (req, res) => {
    const productController = req.locate(ProductController);
    res.json(productController.getProducts());
  });
```

And thus, you've working example with dependency injection installed.

Source Code: [Express-Tiny-Injector](https://github.com/ezzabuzaid/tiny-injector-express)
