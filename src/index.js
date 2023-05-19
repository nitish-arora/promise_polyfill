const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise 1")
  }, 3000)
});

function MyPromise(executor) {
  let onResolve;
  let onReject;
  let isCalled = false;
  let isFulfilled = false;
  let isRejected = false;
  let value;
  let error;

  function resolve(val) {
    isFulfilled = true;
    value = val;
    if (typeof onResolve === 'function' && !isCalled) {
      onResolve(val);
      isCalled = true;
    }
  }

  function reject(err) {
    isRejected = true;
    error = err;
    if (typeof onReject === 'function' && !isCalled) {
      onReject(err);
      isCalled = true;
    }
  }
  this.then = function (thenHandler) {
    onResolve = thenHandler;
    if (!isCalled && isFulfilled) {
      onResolve(value);
    }
    return this;
  }
  this.catch = function (catchHandler) {
    onReject = catchHandler;
    if (!isCalled && isRejected) {
      onReject(error);
    }
    return this;
  }

  executor(resolve, reject);
}

const promise2 = "promise 2";

const promise3 = Promise.resolve("promise3");

const promise4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise 4")
  }, 2000)
});

const promise5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("promise 5");
  }, 1000);
});

const promises = [promise5];



Promise.myAll = function (promiseList) {
  const result = new Array(promiseList.length);
  let fulfilledCount = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseList.length; i++) {
      const promise = promiseList[i];
      Promise.resolve(promise).then(promiseResult => {
        result[i] = promiseResult;
        fulfilledCount++;
        if (fulfilledCount === promiseList.length) {
          resolve(result);
        }
      }).catch(err => reject(err));
    }
  })
}

Promise.myAllSetttled = function (promiseList) {
  const result = new Array(promiseList.length);
  let completed = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseList.length; i++) {
      const promise = promiseList[i];
      Promise.resolve(promise).then(res => {
        result[i] = { status: "fulfilled", value: res };
        completed++;
        if (completed === promiseList.length) {
          resolve(result);
        }
      }).catch(err => {
        result[i] = { status: "rejected", reason: err };
        completed++;
        if (completed === promiseList.length) {
          resolve(result);
        }
      })
    }
  })
};

Promise.myAllSetttled1 = function (promiseList) {
  const promises = promiseList.map(promise => {
    return Promise.resolve(promise).then(res => ({ status: "fullfilled", value: res })).catch(err => ({ status: "rejected", reason: err }))
  });
  return Promise.myAll(promises);
};

Promise.myRace = function (promiseList) {
  return new Promise((resolve, reject) => {
    promiseList.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject);
    })
  })
}

Promise.myAny = function (promiseList) {
  let errorCount = 0;
  return new Promise((resolve, reject) => {
    promiseList.forEach(promise => {
      Promise.resolve(promise).then(res => {
        resolve(res);
      }).catch(err => {
        errorCount++;
        if (errorCount === promiseList.length) {
          reject("AgrregateError: All promises were rejected")
        }
      })
    })
  })
}

// Promise.myAll(promises).then(console.log).catch(console.log);

// Promise.myRace(promises).then(res => console.log("race success", res)).catch(err => console.log("race error", err));

Promise.myAny(promises).then(res => console.log("any success", res)).catch(err => console.log("any error", err));

// Promise.myAllSetttled1(promises).then(result => result.forEach((item) => console.log(item))).catch(console.log);

