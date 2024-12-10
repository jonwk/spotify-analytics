import React from 'react'
import { Link } from 'react-router-dom'
import { StyledSection } from 'src/styles'

const SectionWrapper = ({ children, title, seeAllLink, breadcrumb }) => (
  <StyledSection>
    <div className="section__inner">
      <div className="section__top">
        <h2 className="section__heading">
          {breadcrumb && (
            <span className="section__breadcrumb">
              <Link to="/">Profile</Link>
            </span>
          )}

          {title && (
            <div>
              {seeAllLink ? (
                <Link to={seeAllLink}>{title}</Link>
              ) : (
                <span>{title}</span>
              )}
            </div>
          )}
        </h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="section__see-all">
            See All
          </Link>
        )}
      </div>

      {children}
    </div>
  </StyledSection>
)

export default SectionWrapper
