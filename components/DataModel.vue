<script setup lang="ts">
/**
 * How the workshop data hangs together (based on the connector templates).
 * Customer is the hub: it points to one employee, links to accounts with a role,
 * and is only connected to a company through what the request says.
 */
</script>

<template>
  <div class="dm">
    <!-- row 1: Employee  <-  Customer  ->  Account -->
    <section class="ent tone-orange" style="grid-area: emp">
      <h4><i />Employee</h4>
      <p class="sub">The bank’s own staff</p>
      <ul>
        <li><b>employeeId</b></li>
        <li><b>fullName</b></li>
        <li><b>jobTitle</b>, <b>department</b></li>
      </ul>
    </section>

    <div class="rel h" style="grid-area: r1">
      <span class="chip">employeeId</span>
      <div class="line arrow-left" />
      <p>Every customer has <strong>one</strong> linked employee</p>
    </div>

    <section class="ent hub tone-purple" style="grid-area: cus">
      <h4><i />Customer</h4>
      <p class="sub">The person being onboarded</p>
      <ul>
        <li><b>customerId</b>, <b>name</b>, <b>address</b></li>
        <li><b>email</b> <span>unique</span></li>
        <li><b>trustLevel</b> <span>L1, L2, L3</span></li>
        <li><b>employeeId</b> <span>required</span></li>
      </ul>
    </section>

    <div class="rel h" style="grid-area: r2">
      <span class="chip">role</span>
      <div class="line both" />
      <p><strong>OWNER</strong>, <strong>ADMIN</strong> or <strong>NAMED</strong>. Many customers per account, many accounts per customer</p>
    </div>

    <section class="ent tone-purple" style="grid-area: acc">
      <h4><i />Account</h4>
      <p class="sub">A bank account</p>
      <ul>
        <li><b>accountId</b>, <b>accountNumber</b></li>
        <li><b>type</b> <span>SAVINGS, CORPORATE, PERSONAL</span></li>
        <li><b>balance</b>, <b>currency</b>, <b>status</b></li>
      </ul>
    </section>

    <!-- row 2: Customer ... Company (no stored link) -->
    <div class="rel v" style="grid-area: r3">
      <div class="line dashed" />
      <p><strong>Not stored.</strong> The request says where someone works, e.g. “works at Camunda”</p>
    </div>

    <section class="ent tone-green" style="grid-area: com">
      <h4><i />Company</h4>
      <p class="sub">An employer or supplier</p>
      <ul>
        <li><b>name</b>, <b>countryCode</b>, <b>supplierCode</b></li>
        <li><b>sanctioned</b> <span>true / false</span></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dm {
  display: grid;
  grid-template-columns: 1fr 190px 1.2fr 190px 1.1fr;
  grid-template-rows: auto 56px auto;
  grid-template-areas:
    "emp r1 cus r2 acc"
    ".   .  r3  .  ."
    ".   .  com .  .";
  align-items: stretch;
  font-family: var(--font-body);
}

/* entity cards */
.ent { background: var(--c-sand); padding: 16px 20px 18px; border-top: 4px solid var(--accent); }
.ent.hub { background: var(--c-purple-50); }
.tone-purple { --accent: var(--c-purple); }
.tone-orange { --accent: var(--c-orange); }
.tone-green  { --accent: var(--c-green-600); }
.ent h4 { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 400; color: var(--c-black); letter-spacing: -0.02em; }
.ent h4 i { width: 12px; height: 12px; background: var(--accent); flex: none; }
.ent .sub { margin: 2px 0 10px; font-size: 14px; color: var(--c-mid-gray); }
.ent ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.ent li { font-size: 15px; line-height: 1.35; color: var(--c-mid-gray); padding-left: 0; margin: 0; }
.ent li::before { display: none; } /* drop the deck's orange list squares */
.ent li b { font-weight: 500; color: var(--c-charcoal); }
.ent li span { margin-left: 6px; font-size: 13px; color: var(--c-mid-gray); }

/* relationship connectors */
.rel { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--c-mid-gray); }
.rel p { margin: 0; font-size: 13px; line-height: 1.35; }
.rel strong { font-weight: 500; color: var(--c-charcoal); background: none; padding: 0; } /* no highlighter here */
.chip { font-size: 13px; padding: 2px 8px; background: var(--c-white); border: 1px solid var(--c-gray); color: var(--c-charcoal); }

.rel.h { padding: 0 12px; gap: 8px; }
.rel.h .line { position: relative; width: calc(100% + 24px); height: 0; border-top: 1.5px solid var(--c-mid-gray); }
/* arrowheads */
.line.arrow-left::before,
.line.both::before,
.line.both::after { content: ''; position: absolute; top: -6px; border: 5.5px solid transparent; }
.line.arrow-left::before, .line.both::before { left: 0; border-right: 9px solid var(--c-mid-gray); border-left: 0; }
.line.both::after { right: 0; border-left: 9px solid var(--c-mid-gray); border-right: 0; }

.rel.v { flex-direction: row; justify-content: flex-start; gap: 14px; padding-left: 40px; }
.rel.v .line { align-self: stretch; width: 0; border-left: 1.5px dashed var(--c-mid-gray); }
.rel.v p { text-align: left; max-width: 46ch; }
</style>
