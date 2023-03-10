export default function ErrorMsg({ id, message }) {
  return (
    <small className="-mt-2 text-red-600" role="alert" id={id}>
      {message}
    </small>
  )
}
