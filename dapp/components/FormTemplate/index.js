import { useForm } from "react-hook-form";

export default function FormTemplate(props) {
  const { register, handleSubmit } = useForm();
  const { title, submitAction, submitTitle, fields, children } = props;

  const onSubmit = (data) => {
    submitAction(data);
  };

  return (
    <form action="#" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6 px-4 py-5 sm:p-6">
        <h1 className="text-xl font-medium text-gray-700">{title}</h1>
        <div className="grid gap-6">
          {fields.map((field) =>
            field.type !== "checkbox" ? (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700">
                  {field.title}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register(field.name)}
                    type={field.type ? field.type : "text"}
                    name={field.name}
                    id={field.name}
                    step={field.type === "number" ? 0.000000000000000001 : 0}
                    onChange={() => (!submitTitle ? onSubmit() : false)}
                    className="block w-full flex-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={field.placeHolder ? field.placeHolder : ""}
                  />
                </div>
              </div>
            ) : (
              <div key={field.name} className="flex items-center">
                <input
                  {...register(field.name)}
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  onChange={() =>
                    !submitTitle ? handleSubmit(onSubmit)() : false
                  }
                  className="appearance-none rounded p-2 cursor-pointer border-gray-300 focus:border-slate-500 focus:ring-slate-500 hover:border-slate-500 indeterminate:bg-gray-300 checked:bg-green-500 checked:hover:bg-green-500 checked:focus:bg-green-500 "
                  placeholder={field.placeHolder ? field.placeHolder : ""}
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 cursor-pointer text-sm text-gray-500">
                  {field.title}
                </label>
              </div>
            )
          )}
        </div>
        {children && <>{children}</>}
      </div>

      {submitTitle && (
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 rounded-br rounded-bl">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {submitTitle}
          </button>
        </div>
      )}
    </form>
  );
}
