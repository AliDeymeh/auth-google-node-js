const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const passport = require('passport');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./services/appError');

// const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routers/auth');

const userRouter = require('./routers/users');
// const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use(
  session({
    secret: 'passportConfig.secretdwdwedwdwdwdwdwdKey',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
//!! AUTH ROUT
app.use('/auth', authRouter);

// app.use('/auth/microsoft', authRouterMIC);
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>you are logged in </h1>
    <span>${JSON.stringify(req.user, null, 2)}</span>
    `);
  } else {
    res.redirect('/');
  }
});
app.get('/logout', (req, res, next) => {
  res.logout(err => {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});
// app.use('/', (req, res, next) => {
//   console.log('req- -- - - - - - - ', req);
// });
app.use('/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(globalErrorHandler);

module.exports = app;
