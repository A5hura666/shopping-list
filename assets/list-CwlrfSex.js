import"./style-O7jFx6Bf.js";function c(o){const e=document.getElementById("liste-course-body"),a=document.getElementById("total-general");e.innerHTML="";let n=0;o.forEach((t,r)=>{const i=document.createElement("tr");i.classList.add("border-b","border-b-gray-100");const s=(t.prix_unitaire*t.quantite_stock).toFixed(2);n+=parseFloat(s),i.innerHTML=`
        <td class="py-4 px-4">${t.nom}</td>
        <td class="py-4 px-4">${t.prix_unitaire.toFixed(2)}</td>
        <td class="py-4 px-4">
            <input type="number" class="quantity-input border rounded px-2 py-1 w-16"
                   data-index="${r}" value="${t.quantite_stock}" min="1">
        </td>
        <td class="py-4 px-4 sous-total">${s}</td>
        <td class="py-4 px-4">
            <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                    data-index="${r}">Supprimer</button>
        </td>
    `,e.appendChild(i)}),a.textContent=n>0?`Total général: ${n.toFixed(2)} €`:"",document.getElementById("vider-liste").style.display=o.length>0?"block":"none",document.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",d)}),document.querySelectorAll(".quantity-input").forEach(t=>{t.addEventListener("change",u)})}function l(o,e,a=!1){let n=JSON.parse(localStorage.getItem("produits"))||[];const t=n.find(r=>r.nom===o);t&&(a?t.quantite_stock+=e:t.quantite_stock-=e,localStorage.setItem("produits",JSON.stringify(n)))}function d(o){const e=o.target.getAttribute("data-index"),a=JSON.parse(localStorage.getItem("panier"))||[],n=a[e];a.splice(e,1),localStorage.setItem("panier",JSON.stringify(a)),l(n.nom,n.quantite_stock,!0),c(a)}function u(o){const e=o.target.getAttribute("data-index"),a=JSON.parse(localStorage.getItem("panier"))||[],n=parseInt(o.target.value,10),t=a[e];if(!isNaN(n)&&n>0){const i=JSON.parse(localStorage.getItem("produits")).find(s=>s.nom===t.nom);if(n>i.quantite_stock+t.quantite_stock){alert("Stock insuffisant !"),o.target.value=t.quantite_stock;return}l(t.nom,n-t.quantite_stock),a[e].quantite_stock=n,localStorage.setItem("panier",JSON.stringify(a)),c(a)}else o.target.value=a[e].quantite_stock}function p(){const o=JSON.parse(localStorage.getItem("panier"))||[];confirm("Voulez-vous vraiment vider la liste ?")&&(o.forEach(e=>{l(e.nom,e.quantite_stock,!0)}),localStorage.removeItem("panier"),c([]))}document.addEventListener("DOMContentLoaded",()=>{let o=JSON.parse(localStorage.getItem("panier"))||[];document.getElementById("vider-liste").addEventListener("click",p),c(o)});
