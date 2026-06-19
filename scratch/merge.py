import sys

file_path = 'src/app/page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_hamrobazar = content.find('{/* Hamrobazar Section */}')
end_faq = content.find('{/* CTA Section */}')
end_cta = content.find('{/* WhatsApp Floating Button — smart visibility */}')

if start_hamrobazar == -1 or end_faq == -1 or end_cta == -1:
    print('Could not find sections.')
    sys.exit(1)

hamrobazar_to_faq = content[start_hamrobazar:end_faq]
cta_section = content[end_faq:end_cta]

ham_search = "<div style={{ padding: '32px 28px 28px', textAlign: 'center' }}>"
ham_card_start = hamrobazar_to_faq.find(ham_search)
ham_card_end = hamrobazar_to_faq.find('</div>\n            </div>\n          </div>\n        </section>')
hamrobazar_inner = hamrobazar_to_faq[ham_card_start + len(ham_search):ham_card_end]

cta_inner_start = cta_section.find("<h2 style={{ color: 'white',")
cta_card_end = cta_section.find('</div>\n            </div>\n          </div>\n        </section>')
cta_inner = cta_section[cta_inner_start:cta_card_end]

new_section = """      {/* Cards Section: Hamrobazar & Need Help */}
      <ScrollReveal>
        <section className="section-padding" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          transition: 'var(--theme-transition)',
          paddingBottom: '48px'
        }}>
          <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'stretch'
            }}>
              
              {/* Hamrobazar Card */}
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '32px 28px 28px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>""" + hamrobazar_inner + """              </div>

              {/* Need Help CTA Card */}
              <div className="cta-card" ref={ctaRef} style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
""" + cta_inner + """              </div>

            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

"""

new_content = content[:start_hamrobazar] + new_section + content[end_cta:]
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success!')
