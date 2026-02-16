# Stratégie de tests - WMS

## 1. Tests unitaires (Backend)

### Outils
- **Jest** : Framework de test
- **Supertest** : Tests HTTP

### Exemple - ProductsService

```typescript
// backend/src/products/products.service.spec.ts
describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<getRepositoryToken(Product)>(getRepositoryToken(Product));
  });

  it('should create a product', async () => {
    const dto = { sku: 'SKU001', name: 'Test Product', unit: 'PIECE' };
    const created = { id: 1, ...dto };
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    jest.spyOn(repo, 'create').mockReturnValue(created as any);
    jest.spyOn(repo, 'save').mockResolvedValue(created as any);

    const result = await service.create(dto);
    expect(result.sku).toBe('SKU001');
  });
});
```

### Exécution
```bash
cd backend && npm test
```

---

## 2. Tests d'intégration API

### Exemple - AuthController

```typescript
// backend/test/auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@wms.local', password: 'Admin123!' })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.user.email).toBe('admin@wms.local');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Exécution
```bash
cd backend && npm run test:e2e
```

---

## 3. Tests de charge

### Outil : k6 (Grafana)

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/products?page=1&limit=20', {
    headers: { Authorization: 'Bearer YOUR_JWT_TOKEN' },
  });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

```bash
k6 run load-test.js
```

---

## 4. Couverture

Objectifs recommandés :
- **Services** : > 80%
- **Controllers** : > 70%
- **E2E** : Parcours critiques (login, CRUD produit, stock)
