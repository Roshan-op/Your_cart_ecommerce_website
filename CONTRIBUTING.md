# Contributing to MUSE E-Commerce Platform

Thank you for your interest in contributing to the MUSE Digital Market project! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome people from all backgrounds
- Assume good intentions
- Focus on constructive feedback
- Report inappropriate behavior to maintainers

## 🎯 How to Contribute

### 1. Report Issues

Found a bug or have a feature request?

**Before submitting:**
- Check [existing issues](../../issues) to avoid duplicates
- Provide clear, descriptive title
- Include steps to reproduce (for bugs)
- Share your environment (OS, Python version, etc.)

**Issue Template:**
```markdown
### Description
Brief description of the issue/feature.

### Steps to Reproduce
1. First step
2. Second step
3. ...

### Expected Behavior
What should happen?

### Actual Behavior
What actually happens?

### Environment
- OS: [e.g., Windows 10, macOS 12]
- Python: [e.g., 3.10]
- Node: [e.g., 16.14]
```

### 2. Fork and Clone

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR-USERNAME/your-cart.git
cd your-cart

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/your-cart.git
```

### 3. Create Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bugs:
git checkout -b bugfix/issue-description
```

**Branch Naming Convention:**
- Features: `feature/feature-name`
- Bug fixes: `bugfix/bug-description`
- Improvements: `improvement/description`
- Documentation: `docs/topic`

### 4. Make Changes

Follow these guidelines:

#### Backend (Python/Django)
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use meaningful variable names
- Add docstrings to functions and classes
- Keep functions focused and small
- Add type hints where applicable

```python
# Good example
def get_user_orders(user_id: int) -> List[Order]:
    """
    Retrieve all orders for a specific user.
    
    Args:
        user_id: The ID of the user
    
    Returns:
        List of Order objects for the user
    """
    return Order.objects.filter(user_id=user_id).order_by('-created_at')
```

#### Frontend (React/JavaScript)
- Follow ES6+ standards
- Use functional components and hooks
- Add prop validation with PropTypes or TypeScript
- Keep components small and reusable
- Use meaningful component and variable names

```javascript
// Good example
const ProductCard = ({ product, onAddToCart }) => {
  const handleClick = () => {
    onAddToCart(product);
  };
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.required,
    name: PropTypes.string.required,
    price: PropTypes.number.required,
  }).required,
  onAddToCart: PropTypes.func.required,
};
```

### 5. Test Your Changes

#### Backend Testing
```bash
# Run Django tests
python manage.py test

# Check code style
flake8 .

# Run migrations
python manage.py migrate
```

#### Frontend Testing
```bash
# Run linter
npm run lint

# Run tests (if available)
npm test

# Build for production
npm run build
```

### 6. Commit Changes

```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add product recommendation system"
# or
git commit -m "fix: correct name validation regex"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, etc.

**Example Commits:**
```
feat(cart): add quantity increment/decrement buttons
fix(auth): correct JWT token expiration logic
docs(setup): add Gmail SMTP configuration guide
refactor(products): simplify recommendation algorithm
```

### 7. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
# Fill in the PR template with details
```

**Pull Request Template:**
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #issue-number

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How were changes tested?

## Screenshots (if applicable)
Paste screenshots here.

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

## 📝 Development Workflow

### Setting Up Development Environment

```bash
# Clone and setup
git clone <repo-url>
cd your-cart

# Backend setup
cd Digital-Market-master/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate

# Frontend setup
cd frontend
npm install
npm start  # In another terminal
```

### Common Development Tasks

```bash
# Run backend server
python manage.py runserver

# Run frontend server
npm start

# Create database migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell for testing
python manage.py shell

# Lint frontend code
npm run lint

# Format code
npm run format
```

## 🎓 Project Structure

### Adding Features

1. **Backend Feature:**
   - Add model in `models.py`
   - Create serializer in `serializers.py`
   - Add view in `views/`
   - Create URL route in `urls/`
   - Add tests if applicable

2. **Frontend Feature:**
   - Create component in `components/`
   - Add page in `pages/` if needed
   - Update context if needed
   - Add styles in `.css` file
   - Test in browser

### Modifying Existing Code

- Ensure changes don't break existing functionality
- Update related tests
- Update documentation if needed
- Test thoroughly before submitting

## 🧪 Testing Guidelines

### Backend Tests
- Write unit tests for business logic
- Test API endpoints
- Test serializers and validators
- Test authentication

### Frontend Tests
- Test component rendering
- Test user interactions
- Test state management
- Test API integration

```bash
# Run backend tests
python manage.py test base/tests/

# Run frontend tests
npm test
```

## 📚 Documentation

- Update README.md for major changes
- Add docstrings to Python functions
- Add comments for complex logic
- Update SETUP.md if setup instructions change
- Include examples in documentation

## 🚀 Performance Considerations

- Optimize database queries (use select_related, prefetch_related)
- Implement pagination for large datasets
- Use caching where appropriate
- Minimize API requests from frontend
- Optimize images and assets

## 🔒 Security Best Practices

- Never commit `.env` files or secrets
- Validate all user inputs
- Use parameterized queries
- Hash passwords properly
- Implement rate limiting
- Use HTTPS in production
- Validate JWT tokens

## 📋 Pull Request Review Process

1. **Submission**
   - Push to your branch
   - Create PR with template filled
   - Link related issues

2. **Review**
   - Maintainers will review code
   - May request changes
   - Address feedback in new commits

3. **Approval**
   - Code review approval
   - Tests passing
   - Documentation updated

4. **Merge**
   - PR merged to main
   - Your branch automatically deleted
   - Feature deployed in next release

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## ❓ Questions?

- Check existing issues for similar questions
- Ask in issue comments
- Contact maintainers via email
- Check SETUP.md for setup questions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Helpful Resources

- [Git Workflow](https://guides.github.com/introduction/git-handbook/)
- [GitHub Pull Request Guide](https://docs.github.com/en/pull-requests)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [PEP 8 Style Guide](https://pep8.org/)
- [React Best Practices](https://react.dev/learn)

---

**Thank you for contributing to MUSE! 🎉**

Your contributions help make this project better for everyone.
