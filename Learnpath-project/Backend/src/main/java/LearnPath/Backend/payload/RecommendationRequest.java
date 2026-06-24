package LearnPath.Backend.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecommendationRequest {
    private String branch;
    private String goal;
    private String target_exam; // optional, default ""
}
