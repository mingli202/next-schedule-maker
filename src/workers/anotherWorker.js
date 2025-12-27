self.onmessage = () => {
  console.log("another worker!");
  self.postMessage({ data: "hello" });
};
