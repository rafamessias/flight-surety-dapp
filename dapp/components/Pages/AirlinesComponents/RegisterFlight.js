import Container from "components/Container";

export default function RegisterFlight() {
  return (
    <Container className="mt-10">
      <form action="#" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6 px-4 py-5 sm:p-6">
          <h1 className="text-xl font-medium text-gray-700">Register Flight</h1>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="company-website"
                className="block text-sm font-medium text-gray-700">
                Flight
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="company-website"
                  id="company-website"
                  className="block w-full flex-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="www.example.com"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-br rounded-bl">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Register Flight!
          </button>
        </div>
      </form>
    </Container>
  );
}
