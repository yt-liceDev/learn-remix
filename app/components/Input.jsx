export default function Input({ name, type = "text", defaultValue }) {
  return (
    <input name={name} type={type} className="form-input" defaultValue={defaultValue} />
  )
}
