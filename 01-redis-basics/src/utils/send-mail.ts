export async function sendMail(email:string) {
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });

  console.log(`send mail to ${email} successfully!!!`);
}
