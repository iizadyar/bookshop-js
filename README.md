# bookshop-js

A simple book store API in need of input validation/sanitization.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:

- [Go](https://github.com/andey-robins/bookshop-go)
- [Rust](https://github.com/andey-robins/bookshop-rs)

## Versioning

`bookshop-js` is built with:

- node version v16.19.0
- npm version 9.6.2
- nvm version 0.39.3

## Usage

Start the api using `npm run dev`

I recommend using [`httpie`](https://httpie.io) for testing of HTTP endpoints on the terminal. Tutorials are available elsewhere online, and you're free to use whatever tools you deem appropriate for testing your code.


## Review of the code

The “bookshop” API allows creating a new book/customer/order and fetching the price of an existing book. It also let the user to update an existing customer's shipping address, and fetching the balance of an existing customer. The orders’ shipment status can also be recalled. Overall, the code appears to be relatively well organized. However, there are multiple vectors of attack. There are several areas that the code could be improved as listed below:

(i)	Lack of input validation/sanitization: The codebase does not include any input validation mechanisms, which leaves the system vulnerable to various types of attacks such as SQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF). Input validation is essential to ensure that the data received from users is safe and free from malicious payloads. As a solution, in this assignment, we implement proper input validation mechanisms at each input point. We use regular expressions and input sanitization techniques to ensure that only valid and expected data is accepted by the system.

(ii) Error handling and other code vulnerabilities: The code suffers from the lack of proper error handling in some places. These can lead to code injection attacks and unexpected behavior. We attempted to implement proper error handling mechanisms to handle all possible error scenarios. The error handling mechanisms handle invalid input errors. Return clear and informative error messages to the end user, indicating which input is invalid and how it can be rectified.

(iii) Insecure storage of sensitive information: Sensitive information such as customer balances and addresses are stored in plain text in the database, which poses a security risk in case of a data breach. A possible solution would be to hash and encrypt these information using a secure hashing algorithm such as bcrypt.

(iv) No rate limiting: There is no rate limiting implemented. This means that an attacker could send a large number of requests to the API, causing denial-of-service (DoS) attacks. A possible solution would be to implement rate limiting using a library such as express-rate-limit.

(v) Lack of HTTPS: The code does not enforce HTTPS. Hence, the data over the network can be intercepted, leading to security breaches. The solution implement HTTPS for all communication between the client and server to ensure that data is encrypted and secure during transmission.

There are other security concerns such as lack of authentication and authorization. However, as mentioned in the problem statement, this is assumed not to be a vector of attack.



## Other security bugs and errors (addressed to clean up the code)

(i)	Error handling and server crash: The server crashed when the request was malformed or if requested data (for instance, a book name) did not exist. This issue was resolved by adding a “try...catch” block to various functions in different files (e.g., updateCustomerAddress, getPrice, getShipmentStatus, etc) to catch any errors that occur when for instance, updating the customer's address. If an error is caught, the server will return a 404 status code with a message indicating that the customer could not be found.

(ii)	In the purchaseOrders.ts in the db folder: the SQL statement only included two parameters (?, ?), and the shipped column was not being set to a value and may have defaulted to NULL, depending on your database schema. A third parameter was added and set to 0.

## Input validation and sanitization

We implemented basic input validation and sanitization on the inputs to ensure there is not a vector for attackers to exploit the system. Furthermore, we wanted the interface to communicate to the end user so they could attempt to rectify their bad inputs. The validation needs to consider the title, author, name, shippingAdress, address, etc be string (nonempty) and not include special characters. The Price should always be a positive real number. The cid, bid, and pid should be positive integers. Some examples of the changes that have been implemented in the code are listed below:

(i)	In the createBook function, we validate the title, author, and price inputs. The title and author inputs should be of type string, should not be empty strings, and should not contain special characters. The price input should be a positive number. 

(ii)	In the getPrice function, we validate the title and author inputs. The title and author inputs should be of type string and should not be empty strings. 

(iii)	We included basic sanitization of the inputs as follows: The title and author are trimmed to remove any leading or trailing white spaces. The price is rounded to 2 decimal places and then parsed into a float. All special characters, not alphanumeric or spaces, in the inputs are replaced (using a regular expression pattern) with an empty string (''), effectively removing them from the string.


## Invalid errors return meaningful errors

The API should be modified such that the invalid input is communicated to the end user so they can attempt to rectify their bad inputs. In other words, if the user enters an invalid input (e.g., an empty string is entered for a book title), the software tool used to test APIs will return the appropriate message. Several examples of such communication as well as sanitization, are included in a Word document (error communication) uploaded to my git repo. If any of the input validation fails, we return a (400) error in the .



# Logging

The log file was included in the index.ts file and will record the date and time of the following actions: Creating a new book, a new customer, or a new order; shipping an order; Recalling a customer balance, a book price, an order status, or a shipment status; and finally update a customer address.