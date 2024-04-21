 document.addEventListener('DOMContentLoaded', function() {
     var product = { product | json };

     document.querySelectorAll('.product-options input[type="radio"]').forEach(radio => {
         radio.addEventListener('change', () => {
             // Find Selected Options
             var selectedOptions = []
             document.querySelectorAll('.product-options input[type="radio"]:checked ').forEach(radio => {
                 selectedOptions.push(radio.value);
             })

             // Finding Matched Variants
             var matchedVariant = product.variants.find(variant => {
                 var pass = true

                 for (var i = 0; i < selectedOptions.length; i++) {
                     if (selectedOptions.indexOf(variant.options[i]) === -1) {
                         pass = false;
                         break;
                     }
                 }
                 return pass
             })
             // Change product Form Varients Id
             document.querySelector('#product-id').value = matchedVariant.id

             //Change url
             var url = new URLParse(window.location.href, true)
             url.query.variant = matchedVariant.id
             window.history.replaceState(null, null, url.toString())


             //change prices
             document.querySelector('.product-price').textContent = formatMoney(matchedVariant.price, "{{ shop.money_format }}");
             document.querySelector('.product-compare').textContent = formatMoney(matchedVariant.compare_at_price, "{{ shop.money_format }}");

             matchedVariant.compare_at_price > matchedVariant.price ? document.querySelector('.product-compare').classList.remove('hide') :
                 document.querySelector('.product-compare').classList.add('hide');


             // Change Images
             if (matchedVariant.featuerd_image) {
                 document.querySelector('#product-image').setAttribute('src', matchedVariant.featuerd_image.src);
                 document.querySelector('.thumbs-image li.selected').classList.remove('selected')

                 document.querySelectorAll('.thumbs-image li ')[matchedVariant.featuerd_image.postion].classList.add('selected')
             }

             // Change Button
             var add = document.querySelector("#add-to-cart-button")
             var buy = document.querySelector("#buy-cart-button")
             if (matchedVariant.available) {
                 add.textContent = "Add to Cart"
                 add.disabled = false
                 buy.textContent = "But It Now"
                 buy.disabled = false
             } else {
                 add.textContent = "Out Of Stock"
                 add.disabled = true
                 buy.textContent = "Out Of Stock"
                 buy.disabled = true
             }

         })
     });
 


 document.querySelector('#buy-cart-button').addEventListener('click', (e) => {
     e.preventDefault();

     var form = document.querySelector('.shopify-product-form');

     var input = document.createElement('input');
     input.value = "/checkout";
     input.type = "hidden";
     input.name = "return_to";

     form.appendChild(input);
     form.submit();
 });


 document.querySelectorAll('.thumbs-image li').forEach(li => {
     li.addEventListener('click', () => {
         document.querySelector('.thumbs-image li.selected').classList.remove('selected');
         li.classList.add('selected');
         document.querySelector('#product-image').setAttribute('src', li.querySelector('img').getAttribute('src'));
     });
 });

 document.querySelector('.qs-plus').addEventListener('click', () => {
     var curentval = Number(document.querySelector('#quantity').value)
     document.querySelector('#quantity').value = curentval + 1
 })

 document.querySelector('.qs-minus').addEventListener('click', () => {
     var curentval = Number(document.querySelector('#quantity').value)
     if (curentval > 1) {
         document.querySelector('#quantity').value = curentval - 1
     }
 })