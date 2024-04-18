export default function Contact() {
  return (
    <form method="POST" action="/api/form">
      <label htmlFor="name">Nom:</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <button type="submit">Envoyer</button>
    </form>
  )
}
