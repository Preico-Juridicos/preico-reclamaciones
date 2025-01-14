export const sendBankEmailNotification = async (bankInput) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer pj-258bb83b592469ecfd24799e5ca79da8965822d24d1447f2f6d3da6dab50d1df"
    );

    const raw = JSON.stringify({
      to: "informatica@preicojuridicos.com",
      subject: "[Preico Auto App] NOTIFICACION - No encuentro mi banco",
      bodyHtml: `<p>El banco que no encuentra es: <b>${bankInput}</b></p>`,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://mailer.preicojuridicos.com/api/auto-app", requestOptions)
      .then((response) => response.text())
      .then(() => {})
      .catch((error) => console.error(error));
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
