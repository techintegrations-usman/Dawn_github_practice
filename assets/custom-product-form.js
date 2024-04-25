  var product = {{ product | json }}
    

    document.querySelectorAll('.product-options input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Find Selected Options
            var selectedOptions = [];
            document.querySelectorAll('.product-options input[type="radio"]:checked ').forEach(radio => {
                selectedOptions.push(radio.value);
            });

            // Finding Matched Variants
            var matchedVariant = product.variants.find(variant => {
                var pass = true;

                for (var i = 0; i < selectedOptions.length; i++) {
                    if (selectedOptions.indexOf(variant.options[i]) === -1) {
                        pass = false;
                        break;
                    }
                }
                return pass;
            });

            // Change product Form Variants Id
            document.querySelector('#product-id').value = matchedVariant.id;

            // Change URL
            var urlParams = new URLSearchParams(window.location.search);
            urlParams.set('variant', matchedVariant.id);
            window.history.replaceState(null, null, window.location.pathname + '?' + urlParams.toString());

            // Change prices
            document.querySelector('.product-price').textContent = formatMoney(matchedVariant.price, "{{ shop.money_format }}");
            document.querySelector('.product-compare').textContent = formatMoney(matchedVariant.compare_at_price, "{{ shop.money_format }}");

            matchedVariant.compare_at_price > matchedVariant.price ? document.querySelector('.product-compare').classList.remove('hide') :
                document.querySelector('.product-compare').classList.add('hide');

            // Change Images
            if (matchedVariant.featured_image) {
                document.querySelector('#product-image').setAttribute('src', matchedVariant.featured_image.src);
                document.querySelector('.thumbs-image li.selected').classList.remove('selected');

                document.querySelectorAll('.thumbs-image li')[matchedVariant.featured_image.position].classList.add('selected');
            }

            // Change Button
            var add = document.querySelector("#add-to-cart-button");
            var buy = document.querySelector("#buy-cart-button");
            if (matchedVariant.available) {
                add.textContent = "Add to Cart";
                add.disabled = false;
                buy.textContent = "Buy It Now";
                buy.disabled = false;
            } else {
                add.textContent = "Out Of Stock";
                add.disabled = true;
                buy.textContent = "Out Of Stock";
                buy.disabled = true;
            }
        });
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
        var currentVal = Number(document.querySelector('#quantity').value);
        document.querySelector('#quantity').value = currentVal + 1;
    });

    document.querySelector('.qs-minus').addEventListener('click', () => {
        var currentVal = Number(document.querySelector('#quantity').value);
        if (currentVal > 1) {
            document.querySelector('#quantity').value = currentVal - 1;
        }
    });
