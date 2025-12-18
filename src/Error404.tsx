const Error404 = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800">404</h1>
        <p className="text-2xl text-center text-gray-600">Page not found</p>
        <a
          href="/"
          className="block w-full px-4 py-2 mt-4 text-center text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default Error404;
