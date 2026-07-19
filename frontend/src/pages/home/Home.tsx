import Hero from "./Hero";
import SkillsBento from "./SkillsBento";
import InteractivePlayground from "./InteractivePlayground";
import HeroFeaturedProjects from "./HeroFeaturedProjects";
import ExperienceTimeline from "./ExperienceTimeline";

const Home = () => {
  return (
    <div className="space-y-4 md:space-y-12">
      <Hero />
      <SkillsBento />
      <InteractivePlayground />
      <HeroFeaturedProjects />
      <ExperienceTimeline />
    </div>
  );
};

export default Home;